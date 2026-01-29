import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Moon, Sun, Fingerprint, Github } from 'lucide-react';
import { UUIDVersion, GeneratorSettings, UUIDResult } from './types';
import { generateUUIDs, formatUUID, DNS_NAMESPACE } from './utils/uuidGen';
import SettingsControls from './components/SettingsControls';
import UUIDList from './components/UUIDList';
import Toast from './components/Toast';

const App: React.FC = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Generator State
  const [settings, setSettings] = useState<GeneratorSettings>({
    version: UUIDVersion.V4,
    count: 5,
    uppercase: false,
    removeHyphens: false,
    namespace: DNS_NAMESPACE,
    name: 'example.com'
  });

  const [rawUUIDs, setRawUUIDs] = useState<UUIDResult[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Generate Function
  const handleGenerate = useCallback(() => {
    const newUUIDs = generateUUIDs(
      settings.version,
      settings.count,
      settings.namespace,
      settings.name
    );
    setRawUUIDs(newUUIDs);
  }, [settings.version, settings.count, settings.namespace, settings.name]);

  // Initial Generate on Mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update Settings Wrapper
  const updateSettings = (newSettings: Partial<GeneratorSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // If version, count, namespace, or name changes, we should ideally regenerate
      // BUT for count, we might want to preserve existing ones? No, usually simpler to regen.
      // However, for UX, let's auto-regenerate ONLY if the determinism changes (v3/v5 namespace/name)
      // For version change, definitely regen.
      
      const shouldRegen = 
        newSettings.version !== undefined || 
        newSettings.count !== undefined ||
        (updated.version === UUIDVersion.V3 || updated.version === UUIDVersion.V5 ? (newSettings.name !== undefined || newSettings.namespace !== undefined) : false);

      if (shouldRegen) {
        // We need to defer this slightly or call generation with new settings immediately
        // Here we just set state, and use an effect or immediate call
        // To avoid stale state issues, we won't call handleGenerate here directly dependent on state
        // Instead, we will rely on the user clicking Generate OR use an Effect.
        // The prompt asks for "Real-time generation".
      }
      return updated;
    });
  };

  // Real-time generation effect for settings that affect the raw value
  useEffect(() => {
     handleGenerate();
  }, [settings.version, settings.count, settings.namespace, settings.name, handleGenerate]);


  // Computed formatted UUIDs
  // We do this separately so toggling uppercase/hyphens is instant and doesn't change the underlying UUIDs
  const formattedUUIDs = useMemo(() => {
    return rawUUIDs.map(u => formatUUID(u.value, settings.uppercase, settings.removeHyphens));
  }, [rawUUIDs, settings.uppercase, settings.removeHyphens]);

  // Copy Handler
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast('已复制到剪贴板');
    }).catch(() => {
      setToast('复制失败');
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Fingerprint size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">
              UUID 生成器 <span className="text-indigo-600 font-light">Pro</span>
            </h1>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:hidden">
              UUID <span className="text-indigo-600">Gen</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        
        <SettingsControls 
          settings={settings}
          updateSettings={updateSettings}
          onGenerate={handleGenerate}
        />

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UUIDList 
            uuids={rawUUIDs}
            formattedUUIDs={formattedUUIDs}
            onCopy={handleCopy}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">
            使用标准 RFC4122 算法在客户端生成，安全且隐私。
          </p>
          <p className="text-xs opacity-70">
             V4 和 V7 使用强加密随机性，V1 基于时间。
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

    </div>
  );
};

export default App;