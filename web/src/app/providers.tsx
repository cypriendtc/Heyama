'use client';

import { I18nProvider } from '@/lib/i18n';
import { Navbar } from '@/components/navbar';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </I18nProvider>
  );
}
