import React, { useCallback } from 'react';
import { Copy, Check, FileStack } from 'lucide-react';
import { UUIDResult } from '../types';

interface UUIDListProps {
  uuids: UUIDResult[];
  formattedUUIDs: string[]; // Separated to avoid re-calculating in render loop if parent handles it
  onCopy: (text: string) => void;
}

const UUIDList: React.FC<UUIDListProps> = ({ uuids, formattedUUIDs, onCopy }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = useCallback((text: string, id: string) => {
    onCopy(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, [onCopy]);

  const handleCopyAll = () => {
    onCopy(formattedUUIDs.join('\n'));
    setCopiedId('ALL');
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (uuids.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-600">
        <p>点击生成按钮开始</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          生成结果 ({uuids.length})
        </h3>
        {uuids.length > 0 && (
          <button
            onClick={handleCopyAll}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            {copiedId === 'ALL' ? <Check size={14} /> : <FileStack size={14} />}
            {copiedId === 'ALL' ? '已复制全部!' : '复制全部'}
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {uuids.map((uuid, index) => {
          const displayValue = formattedUUIDs[index];
          const isCopied = copiedId === uuid.id;

          return (
            <div
              key={uuid.id}
              className="group relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 pr-2 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
            >
              <div className="flex-none w-10 h-10 flex items-center justify-center text-gray-300 dark:text-gray-600 font-mono text-xs select-none">
                {index + 1}
              </div>
              
              <div className="flex-1 font-mono text-sm sm:text-base text-gray-800 dark:text-gray-200 break-all py-2 selection:bg-indigo-100 dark:selection:bg-indigo-900">
                {displayValue}
              </div>

              <button
                onClick={() => handleCopy(displayValue, uuid.id)}
                aria-label="复制 UUID"
                className={`flex-none w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                  isCopied
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 opacity-100 sm:opacity-0 group-hover:opacity-100'
                }`}
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UUIDList;