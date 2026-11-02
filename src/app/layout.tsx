import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'ApplyTrack — Never lose track of an opportunity',
  description: 'The simple, fast, and mobile-friendly job application management platform built for Indian college students, freshers, and placement candidates.',
  keywords: 'job tracker, placement tracker, internship tracker, college placement, fresher jobs, career management, India campus placements',
  authors: [{ name: 'ApplyTrack Team' }],
  openGraph: {
    title: 'ApplyTrack — Never lose track of an opportunity',
    description: 'Track applications, interviews, deadlines, and preparation all in one place.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-900 bg-slate-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
