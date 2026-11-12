import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Āradhana (Practice)",
};

export default function AradhanaIndex() {
  return (
    <main
      style={{
        maxWidth: "var(--content-width)",
        margin: "0 auto",
        padding: "6rem 1.5rem",
        minHeight: "80vh",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "3.2rem",
            color: "var(--color-night-ink)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: "2rem",
          }}
        >
          Āradhana
        </h1>

        <p
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.2rem",
            color: "var(--color-night-muted)",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          Jain observances and interpretations differ across communities and personal commitments. This section is an educational draft; its descriptions and translations are still being checked against named sources.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          {/* Section: Foundational Prayers & Stotras */}
          <section>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2rem",
                color: "var(--color-night-ink)",
                fontWeight: 400,
                borderBottom: "1px solid var(--color-night-border)",
                paddingBottom: "1rem",
                marginBottom: "2rem",
              }}
            >
              Foundational Prayers & Stotras
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              <Link
                href="/aradhana/navkar-mantra"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Navkar Mantra
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  A widely known Jain salutation. Its wording, translation, and interpretation are being checked against specific sources.
                </p>
              </Link>

              <Link
                href="/aradhana/chattari-mangalam"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Chattari Mangalam
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  A prayer naming auspicious refuges in some Jain liturgies; wording and use vary by context.
                </p>
              </Link>

              <Link
                href="/aradhana/logassa-sutra"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Logassa Sutra
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  A hymn that praises the twenty-four Tirthankaras; editions and translations need source review.
                </p>
              </Link>

              <Link
                href="/aradhana/uvassagharam"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Uvasaggaharam Stotra
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  A devotional stotra associated with Pārśvanātha; its text and interpretations need source review.
                </p>
              </Link>

              <Link
                href="/aradhana/bhaktamar-stotra"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Bhaktamar Stotra
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  A Sanskrit stotra in Jain devotional practice; its attribution, text, and translations need source review.
                </p>
              </Link>
            </div>
          </section>

          {/* Section: Rituals & Observances */}
          <section>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2rem",
                color: "var(--color-night-ink)",
                fontWeight: 400,
                borderBottom: "1px solid var(--color-night-border)",
                paddingBottom: "1rem",
                marginBottom: "2rem",
              }}
            >
              Rituals & Observances
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              <Link
                href="/aradhana/pratikraman"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Pratikraman
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  The ritual of repentance. A structured reflection undertaken to recognize faults, seek forgiveness, and renew vows of non-violence.
                </p>
              </Link>

              <Link
                href="/aradhana/khamemi-savva-jive"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Khamemi Savva Jive
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  A verse associated with forgiveness; its wording and use should be understood within a specific tradition and context.
                </p>
              </Link>

              <Link
                href="/aradhana/paryushana"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: "1px solid var(--color-night-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  background: "var(--color-night)",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                className="hover:border-[var(--color-saffron)]"
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    color: "var(--color-saffron)",
                    fontWeight: 400,
                    marginBottom: "0.75rem",
                  }}
                >
                  Paryushana & Das Lakshana
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    color: "var(--color-night-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Annual observances whose dates, duration, and practices vary across Jain communities. See the sourced overview.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
