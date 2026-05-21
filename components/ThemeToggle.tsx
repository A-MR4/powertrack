'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'powertrack-theme';

type ThemeMode = 'light' | 'dark';

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const buttonClassName = theme === 'dark'
    ? 'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-300'
    : 'inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={buttonClassName}
    >
      {theme === 'dark' ? 'Oscuro' : 'Claro'}
    </button>
  );
}
