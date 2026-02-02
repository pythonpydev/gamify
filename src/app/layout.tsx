import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Pokerdoro - Gamified Pomodoro Timer',
  description: 'Turn your study sessions into poker winnings. Earn chips, climb ranks, and master your focus.',
  keywords: ['pomodoro', 'timer', 'study', 'gamification', 'productivity', 'poker'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
