import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Heyama Objects',
  description: 'Manage your collection of Objects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-white">
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="48" fill="white" fillOpacity="0.2" />
                <path
                  d="M50 80C50 80 20 60 20 40C20 30 28 22 38 22C44 22 48 26 50 30C52 26 56 22 62 22C72 22 80 30 80 40C80 60 50 80 50 80Z"
                  fill="white"
                />
              </svg>
              <span className="text-xl font-bold">Heyama</span>
            </a>
            <a
              href="/create"
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
            >
              + New Object
            </a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
