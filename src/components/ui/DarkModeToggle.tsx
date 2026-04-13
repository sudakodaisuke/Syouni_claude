'use client';

import { useDarkMode } from '@/hooks/useDarkMode';

export function DarkModeToggle() {
  const { mode, setDarkMode } = useDarkMode();

  const options: { value: 'light' | 'dark' | 'system'; label: string }[] = [
    { value: 'light', label: '☀️' },
    { value: 'system', label: '🖥️' },
    { value: 'dark', label: '🌙' },
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setDarkMode(opt.value)}
          className={`px-2.5 py-1 rounded-full text-sm transition-colors ${
            mode === opt.value
              ? 'bg-white dark:bg-gray-900 shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
