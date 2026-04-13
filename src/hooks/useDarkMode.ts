'use client';

import { useState, useEffect } from 'react';
import { getSettings, setSettings } from '@/lib/localStorage';

export function useDarkMode() {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const settings = getSettings();
    setMode(settings.darkMode);
    applyTheme(settings.darkMode);
  }, []);

  function applyTheme(m: 'light' | 'dark' | 'system') {
    const isDark =
      m === 'dark' ||
      (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }

  function setDarkMode(m: 'light' | 'dark' | 'system') {
    const settings = getSettings();
    setSettings({ ...settings, darkMode: m });
    setMode(m);
    applyTheme(m);
  }

  return { mode, setDarkMode };
}
