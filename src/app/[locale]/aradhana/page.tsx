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

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Card 1 */}
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
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                color: "var(--color-saffron)",
                fontWeight: 400,
                marginBottom: "0.75rem",
              }}
            >
              Navkar Mantra
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.95rem",
                color: "var(--color-night-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              The foundational prayer of Jainism. It is an obeisance to spiritual virtues rather than to specific historical figures or deities.
            </p>
          </Link>

          {/* Card 2 */}
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
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                color: "var(--color-saffron)",
                fontWeight: 400,
                marginBottom: "0.75rem",
              }}
            >
              Pratikraman
            </h2>
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

          {/* Card 3 */}
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
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                color: "var(--color-saffron)",
                fontWeight: 400,
                marginBottom: "0.75rem",
              }}
            >
              Paryushana & Das Lakshana
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.95rem",
                color: "var(--color-night-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              The most significant annual observances in Jainism, dedicated to fasting, scriptural study, and universal forgiveness (Micchami Dukkadam).
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
