import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Serif_4, Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { routing, type SiteLocale, Link } from "@/i18n/routing";
import { LocaleProvider } from "@/i18n/LocaleProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Learn About Jainism",
    template: "%s · Learn About Jainism",
  },
  description:
    "Explore Jain ideas, communities, texts, and practices through a growing, source-aware learning library.",
  applicationName: "Learn About Jainism",
  openGraph: {
    siteName: "Learn About Jainism",
    title: "Learn About Jainism",
    description:
      "A calm introduction to Jain ideas, communities, texts, and practices, with editorial review status made clear.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Learn About Jainism",
    description: "Explore Jain ideas, communities, texts, and practices through a growing study library.",
  },
};

export function generateStaticParams() {
  return routing.publishedLocales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${sourceSerif.variable} ${inter.variable}`}>
      <body>
        <LocaleProvider locale={locale as SiteLocale}>
          <a className="skip-link" href="#page-content">Skip to content</a>

          <header className="site-header">
            <div className="site-container site-header__inner">
              <Link className="site-brand" href="/" aria-label="Learn About Jainism home">
                <span className="site-brand__mark" aria-hidden="true">J</span>
                <span className="site-brand__wordmark">
                  <span>Jainism</span>
                  <small>Learning library</small>
                </span>
              </Link>

              <nav className="site-nav" aria-label="Main navigation">
                <Link href="/start-here">Start here</Link>
                <Link href="/ontology">Library</Link>
                <Link href="/aradhana">Ārādhana</Link>
                <Link href="/about-this-library">Our method</Link>
              </nav>
            </div>
          </header>

          <div className="site-status" role="note">
            <div className="site-container site-status__inner">
              <span className="site-status__label">Research in progress</span>
              <p>Topic summaries are drafts until their sources and tradition notes are reviewed.</p>
              <Link href="/about-this-library">Editorial method <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div id="page-content" tabIndex={-1}>
            {children}
          </div>

          <footer className="site-footer">
            <div className="site-container site-footer__grid">
              <div className="site-footer__about">
                <Link className="site-footer__brand" href="/">Learn About Jainism</Link>
                <p>
                  An English-language learning resource. It does not speak for every Jain community
                  or replace guidance from qualified teachers.
                </p>
              </div>
              <div>
                <h2>Explore</h2>
                <ul>
                  <li><Link href="/start-here">Start here</Link></li>
                  <li><Link href="/ontology">Topic library</Link></li>
                  <li><Link href="/aradhana">Ārādhana</Link></li>
                </ul>
              </div>
              <div>
                <h2>About</h2>
                <ul>
                  <li><Link href="/about-this-library">Editorial method</Link></li>
                  <li><Link href="/ontology/D01.T005">Diversity within Jainism</Link></li>
                </ul>
              </div>
            </div>
            <div className="site-container site-footer__bottom">
              <span>English edition · Editorial review is ongoing</span>
              <span>Respectful study, careful attribution, room for difference.</span>
            </div>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
