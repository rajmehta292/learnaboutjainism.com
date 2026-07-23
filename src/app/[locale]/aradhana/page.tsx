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
          Jain practice ranges from small daily acts of awareness to demanding forms of monastic discipline. These practices are not all expected of every person. This section explains their purpose, context, traditional forms, and the different ways people may encounter them.
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
                  The foundational prayer of Jainism, offering obeisance to spiritual virtues rather than specific individuals.
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
                  The universal sutra seeking refuge in the four most auspicious entities, often recited daily.
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
                  A core prayer praising the twenty-four Tirthankaras and seeking spiritual health and equanimity.
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
                  A powerful devotional hymn dedicated to Lord Parshvanatha, recited for peace and the removal of obstacles.
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
                  The most famous Sanskrit hymn in Jainism, renowned for its poetic beauty and spiritual efficacy.
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
                  The universal prayer of forgiveness, releasing all inner resentment and extending friendship to all beings.
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
                  The most significant annual observances, dedicated to fasting, scriptural study, and profound introspection.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
