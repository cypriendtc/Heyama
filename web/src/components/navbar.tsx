'use client';

import { useTranslation } from '@/lib/i18n';

function HeyamaLogo() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="5" fill="none" />
      <path
        d="M50 75C50 75 25 58 25 42C25 34 31 28 39 28C44 28 47.5 31 50 35C52.5 31 56 28 61 28C69 28 75 34 75 42C75 58 50 75 50 75Z"
        fill="white"
      />
    </svg>
  );
}

export function Navbar() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 text-white">
          <HeyamaLogo />
          <span className="text-xl font-bold tracking-tight">Heyama</span>
        </a>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/15 backdrop-blur rounded-full p-0.5">
            <button
              onClick={() => setLocale('fr')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                locale === 'fr'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
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
            className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
          >
            {t('nav.new')}
          </a>
        </div>
      </div>
    </nav>
  );
}
