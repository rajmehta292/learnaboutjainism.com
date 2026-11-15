import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Serif_4, Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { routing, type SiteLocale, Link } from "@/i18n/routing";
import { englishHref, getMessages } from "@/i18n/messages";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeValue } = await params;
  if (!routing.locales.includes(localeValue as SiteLocale)) return {};
  const locale = localeValue as SiteLocale;
  const copy = getMessages(locale);
  const home = copy.Home;

  return {
    metadataBase: new URL("https://learnaboutjainism.com"),
    title: { default: home.metadataTitle, template: `%s · ${copy.Navigation.brand}` },
    description: home.metadataDescription,
    applicationName: copy.Navigation.brand,
    robots: locale === "en" ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      siteName: copy.Navigation.brand,
      title: home.metadataTitle,
      description: home.metadataDescription,
      type: "website",
      locale: locale === "gu" ? "gu_IN" : locale === "hi" ? "hi_IN" : "en_US",
    },
    twitter: { card: "summary_large_image", title: home.metadataTitle, description: home.metadataDescription },
  };
}

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
  const { locale: localeValue } = await params;
  if (!routing.locales.includes(localeValue as SiteLocale)) notFound();
  const locale = localeValue as SiteLocale;
  const copy = getMessages(locale);
  const nav = copy.Navigation;
  const htmlLang = locale === "gu" ? "gu-IN" : locale === "hi" ? "hi-IN" : "en";

  return (
    <html lang={htmlLang} className={`${cormorant.variable} ${sourceSerif.variable} ${inter.variable}`}>
      <body>
        <LocaleProvider locale={locale}>
          <a className="skip-link" href="#page-content">{nav.skip}</a>

          <header className="site-header">
            <div className="site-container site-header__inner">
              <Link className="site-brand" href="/" aria-label={nav.homeLabel}>
                <span className="site-brand__mark" aria-hidden="true">{locale === "gu" ? "જ" : locale === "hi" ? "ज" : "J"}</span>
                <span className="site-brand__wordmark">
                  <span>{nav.brand}</span>
                  <small>{nav.brandTagline}</small>
                </span>
              </Link>

              <div className="site-header__actions">
                <nav className="site-nav" aria-label={nav.navLabel}>
                  <Link href="/start-here">{nav.start}</Link>
                  <Link href="/ontology">{nav.library}</Link>
                  <Link href="/aradhana">{nav.practice}</Link>
                  <Link href="/about-this-library">{nav.method}</Link>
                </nav>
                <LanguageSwitcher copy={nav} />
              </div>
            </div>
          </header>

          <div id="page-content" tabIndex={-1}>
            {children}
          </div>

          <footer className="site-footer">
            <div className="site-container site-footer__grid">
              <div className="site-footer__about">
                <Link className="site-footer__brand" href="/">{nav.brand}</Link>
                <p>{nav.footerBlurb}</p>
              </div>
              <div>
                <h2>{nav.footerExplore}</h2>
                <ul>
                  <li><Link href="/start-here">{nav.start}</Link></li>
                  <li><Link href="/ontology">{nav.library}</Link></li>
                  <li><Link href="/aradhana">{nav.practice}</Link></li>
                </ul>
              </div>
              <div>
                <h2>{nav.footerAbout}</h2>
                <ul>
                  <li><Link href="/about-this-library">{nav.method}</Link></li>
                  <li><Link href={englishHref(locale, "/ontology/D01.T005")}>{nav.footerDiversity}</Link></li>
                  <li>
                    <a
                      href="https://github.com/rajmehta292/learnaboutjainism.com/issues/new?template=reader-feedback.yml"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {nav.footerFeedback} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                  <li><Link href={englishHref(locale, "/admin")}>{nav.adminLogin}</Link></li>
                </ul>
              </div>
            </div>
            <div className="site-container site-footer__bottom">
              <span>{nav.footerLine}</span>
            </div>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
