import { Geist_Mono, Inter } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { ReactQueryProvider } from '@/providers/react-query-providers';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { DialogProvider } from '@/providers/dailog-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        inter.variable
      )}
    >
      <body cz-shortcut-listen="true">
        {/* TODO need to add Auth Providers also */}
        {/* TODO need to add query key ulti function */}
        {/* TODO need to add class for fetching data */}
        <ReactQueryProvider>
          <ThemeProvider>
            <DialogProvider>
              <TooltipProvider>
                <Toaster />
                {children}
              </TooltipProvider>
            </DialogProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
