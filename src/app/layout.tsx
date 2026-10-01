import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Zetoid - AI-Powered Task Management',
  description:
    'Natural-language task capture, smart prioritization, and conversational reminders powered by Next.js and Gemini 3.8 Flash.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0e0c] text-slate-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pb-16">{children}</main>
          <footer className="border-t border-emerald-950/40 py-6 text-center text-xs text-slate-500">
            <p>Zetoid • Built with Next.js 15, React 19 & Vercel AI SDK (Gemini 3.8 Flash)</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
