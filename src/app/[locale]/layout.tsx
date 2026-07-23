import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Serif_4, Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';

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
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jainism — A Living Tradition",
    template: "%s · Jainism",
  },
  description:
    "An unhurried guide to Jain philosophy, history, scripture, and practice — from the Tattvas to the Tirthankaras.",
  openGraph: {
    siteName: "Jainism — A Living Tradition",
    type: "website",
  },
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
    <html lang={locale} className={`${cormorant.variable} ${sourceSerif.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>

          {/* ── Masthead ─────────────────────────────── */}
          <header
            style={{
              background: "var(--color-night)",
              borderBottom: "1px solid var(--color-night-border)",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "0 1.5rem",
                height: "3.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Wordmark */}
              <Link
                href="/"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "1.45rem",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                  color: "var(--color-night-ink)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                Jainism
              </Link>

              {/* Nav links */}
              <nav
                style={{
                  display: "flex",
                  gap: "0",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/aradhana", label: "Āradhana" },
                  { href: "/ontology", label: "The Library" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      color: "var(--color-night-muted)",
                      textDecoration: "none",
                      padding: "0 1.1rem",
                      height: "3.75rem",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "2px solid transparent",
                      transition: "color 0.15s, border-color 0.15s",
                    }}
                    className="nav-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {children}

          {/* ── Footer ───────────────────────────────── */}
          <footer
            style={{
              background: "var(--color-night)",
              borderTop: "1px solid var(--color-night-border)",
              padding: "3rem 1.5rem",
            }}
          >
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.1rem", color: "var(--color-night-ink)", marginBottom: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Jainism
                </p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "var(--color-night-muted)", margin: 0, maxWidth: "340px", lineHeight: 1.65 }}>
                  This site compiles scholarly sources and primary texts. It does not constitute religious authority. Practices described vary across traditions; consult qualified teachers for personal guidance.
                </p>
              </div>
              <div style={{ display: "flex", gap: "3rem" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-saffron)", marginBottom: "0.75rem" }}>Practice</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {[
                      { href: "/aradhana", label: "Āradhana Index" },
                      { href: "/aradhana/navkar-mantra", label: "Navkar Mantra" },
                      { href: "/aradhana/chattari-mangalam", label: "Chattari Mangalam" },
                      { href: "/aradhana/logassa-sutra", label: "Logassa Sutra" },
                      { href: "/aradhana/uvassagharam", label: "Uvasaggaharam Stotra" },
                      { href: "/aradhana/bhaktamar-stotra", label: "Bhaktamar Stotra" },
                      { href: "/aradhana/khamemi-savva-jive", label: "Khamemi Savva Jive" },
                      { href: "/aradhana/pratikraman", label: "Pratikraman" },
                      { href: "/aradhana/paryushana", label: "Paryushana" },
                    ].map(l => (
                      <Link key={l.href} href={l.href} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", color: "var(--color-night-muted)", textDecoration: "none" }}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-saffron)", marginBottom: "0.75rem" }}>Study</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {[
                      { href: "/ontology", label: "The Library" },
                      { href: "/ontology/D02.T001", label: "Moksha" },
                      { href: "/ontology/D06.T001", label: "Karma" },
                      { href: "/ontology/D26.T002", label: "Tirthankaras" },
                    ].map(l => (
                      <Link key={l.href} href={l.href} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", color: "var(--color-night-muted)", textDecoration: "none" }}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
