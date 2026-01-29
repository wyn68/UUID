import React from 'react';
import { Settings, RefreshCw, Hash, Type, Link, Globe } from 'lucide-react';
import { UUIDVersion, GeneratorSettings } from '../types';
import { DNS_NAMESPACE } from '../utils/uuidGen';

interface SettingsControlsProps {
  settings: GeneratorSettings;
  updateSettings: (newSettings: Partial<GeneratorSettings>) => void;
  onGenerate: () => void;
}

const SettingsControls: React.FC<SettingsControlsProps> = ({ settings, updateSettings, onGenerate }) => {
  
  const isNamespaceRequired = settings.version === UUIDVersion.V3 || settings.version === UUIDVersion.V5;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-all">
      <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-semibold text-lg">
        <Settings size={20} className="text-indigo-600 dark:text-indigo-400" />
        <h2>配置选项</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Version Selector */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            UUID 版本
          </label>
          <div className="relative">
            <select
              value={settings.version}
              onChange={(e) => updateSettings({ version: e.target.value as UUIDVersion })}
              className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              <option value={UUIDVersion.V1}>Version 1 (基于时间)</option>
              <option value={UUIDVersion.V3}>Version 3 (基于名称 MD5)</option>
              <option value={UUIDVersion.V4}>Version 4 (随机生成)</option>
              <option value={UUIDVersion.V5}>Version 5 (基于名称 SHA-1)</option>
              <option value={UUIDVersion.V7}>Version 7 (基于时间排序)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            数量 ({settings.count})
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={settings.count}
              onChange={(e) => updateSettings({ count: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <input 
              type="number"
              min="1"
              max="100"
              value={settings.count}
              onChange={(e) => {
                const val = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                updateSettings({ count: val });
              }}
              className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-center text-sm rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="lg:col-span-6 flex flex-col md:flex-row gap-4 items-end pb-1">
          <button
            onClick={() => updateSettings({ uppercase: !settings.uppercase })}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
              settings.uppercase
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300'
                : 'bg-white border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Type size={16} />
            {settings.uppercase ? '大写' : '小写'}
          </button>
          
          <button
            onClick={() => updateSettings({ removeHyphens: !settings.removeHyphens })}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
              settings.removeHyphens
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300'
                : 'bg-white border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Hash size={16} />
            {settings.removeHyphens ? '无连字符' : '有连字符'}
          </button>
        </div>

      </div>

      {/* Namespace Inputs for v3/v5 */}
      {isNamespaceRequired && (
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
           <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Globe size={14} /> 命名空间 (UUID)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={settings.namespace}
                onChange={(e) => updateSettings({ namespace: e.target.value })}
                placeholder="例如：6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                onClick={() => updateSettings({ namespace: DNS_NAMESPACE })}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="使用 DNS 命名空间"
              >
                DNS
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Link size={14} /> 名称
            </label>
            <input 
              type="text" 
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              placeholder="例如：www.example.com"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Main Generate Button (Mobile Sticky support handled in layout, this is desktop/inline) */}
      <div className="mt-6">
        <button
          onClick={onGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          生成 UUID
        </button>
      </div>
    </div>
  );
};

export default SettingsControls;