"use client";

import { useEffect, useState } from "react";

export default function LocaleSwitcher() {
  const [locale, setLocale] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
    const current = match ? decodeURIComponent(match[1]) : 'en';
    if (current === 'fr' || current === 'en') setLocale(current);
  }, []);

  const switchTo = (next: 'en' | 'fr') => {
    if (next === locale) return;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `NEXT_LOCALE=${next}; path=/; expires=${expires.toUTCString()}`;
    window.location.reload();
  };

  return (
    <div className="bg-white/90 backdrop-blur border rounded-md shadow-sm flex overflow-hidden">
      <button
        aria-label="Switch to English"
        onClick={() => switchTo('en')}
        className={`px-3 py-1 text-sm ${locale === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}
      >
        EN
      </button>
      <button
        aria-label="Basculer en français"
        onClick={() => switchTo('fr')}
        className={`px-3 py-1 text-sm ${locale === 'fr' ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}
      >
        FR
      </button>
    </div>
  );
}

