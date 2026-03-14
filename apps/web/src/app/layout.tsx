import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/providers/react-query-provider';

export const metadata: Metadata = {
  title: 'Drive MVP',
  description: 'Authentication-ready MVP for a file storage and sharing platform.',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
