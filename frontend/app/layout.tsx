import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'AI-Powered Intelligent Land Record Digitization and Validation System',
  description:
    'Modernizing historical Indian land records through AI-driven OCR, validation workflows, and human-in-the-loop verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
