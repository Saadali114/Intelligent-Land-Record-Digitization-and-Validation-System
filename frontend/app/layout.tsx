import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';
import { AuthProvider } from '../context/AuthContext';
import I18nProvider from '../providers/I18nProvider';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var size = localStorage.getItem('ilrdvs_font_size');
                if (size === 'small') {
                  document.documentElement.setAttribute('data-font-size', 'small');
                  document.documentElement.style.fontSize = '87.5%';
                } else if (size === 'large') {
                  document.documentElement.setAttribute('data-font-size', 'large');
                  document.documentElement.style.fontSize = '115%';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <I18nProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
