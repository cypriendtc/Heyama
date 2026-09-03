'use client';

import { useTranslation } from '@/lib/i18n';

export function Navbar() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-white shrink-0">
          <img src="/logo.webp" alt="Heyama" className="h-9 w-9 rounded-full" />
          <span className="text-xl font-bold tracking-tight">Heyama</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-white/15 backdrop-blur rounded-full p-0.5">
            <button
              onClick={() => setLocale('fr')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                locale === 'fr'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                locale === 'en'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="/create"
            className="bg-white/20 backdrop-blur text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">+</span>
            <span className="hidden sm:inline">{t('nav.new')}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
