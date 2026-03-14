import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/providers/react-query-provider';

export const metadata: Metadata = {
  title: 'Drive MVP',
  description:
    'Neo-Brutalist file storage and sharing MVP with NestJS, Next.js, S3 uploads, permissions, and realtime updates.',
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
