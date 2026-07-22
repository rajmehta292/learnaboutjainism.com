import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-noto-serif" });

export const metadata: Metadata = {
  title: "Learn About Jainism",
  description: "The definitive digital resource for Jainism.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${notoSerif.variable} antialiased bg-[#FAF9F6] text-[#2C3E50]`}>
        <NextIntlClientProvider messages={messages}>
          <nav className="w-full bg-[#F5F5F0] border-b border-[#E8E6DF] px-6 py-4 flex items-center justify-between shadow-sm">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1A252C]">LearnAboutJainism</h1>
            <div className="flex gap-6 font-sans text-sm font-medium">
              <a href={`/${locale}`} className="hover:text-[#C17817] transition-colors">Home</a>
              <a href={`/${locale}/ontology`} className="hover:text-[#C17817] transition-colors">Library</a>
            </div>
          </nav>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
