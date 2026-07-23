import { Link } from '@/i18n/routing';
import fs from 'fs';
import path from 'path';

function getFeaturedTopics() {
  // Curated featured entries — pulled from the ontology by known ID
  return [
    { id: "D02.T001", label: "Moksha", subtitle: "The nature of liberation and what it means to be free" },
    { id: "D06.T001", label: "Karma", subtitle: "Subtle matter, moral causation, and the mechanics of rebirth" },
    { id: "D05.T010", label: "The Seven Tattvas", subtitle: "The seven realities that form the basis of all Jain doctrine" },
    { id: "D08.T001", label: "Anekāntavāda", subtitle: "Many-sidedness of truth — the most radical of Jain contributions" },
    { id: "D26.T002", label: "The Twenty-Four Tirthankaras", subtitle: "The ford-makers who crossed the ocean of existence" },
    { id: "D11.T001", label: "Gunasthanaks", subtitle: "The fourteen stages of a soul's ascent toward liberation" },
  ];
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--color-night)",
          color: "var(--color-night-ink)",
          padding: "7rem 1.5rem 6rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-saffron)",
              marginBottom: "1.8rem",
            }}
          >
            A living tradition · 2,600 years of thought
          </p>

          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2.8rem, 7vw, 5.2rem)",
              fontWeight: 300,
              letterSpacing: "-0.01em",
              lineHeight: 1.08,
              color: "var(--color-night-ink)",
              margin: "0 0 2rem",
            }}
          >
            There is no path to liberation<br />that does not begin with understanding
          </h1>

          <p
            style={{
              fontFamily: "var(--font-source-serif), Georgia, serif",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "var(--color-night-muted)",
              maxWidth: "560px",
              margin: "0 auto 2.8rem",
            }}
          >
            Jainism is among the oldest living philosophies. Its teachings on non-violence,
            the nature of the soul, and the structure of reality are as rigorous as they are
            demanding. This library gathers what the tradition has said, in its own words.
          </p>

          <Link
            href="/ontology"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-saffron)",
              border: "1px solid var(--color-saffron)",
              padding: "0.75rem 2rem",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Enter the Library
          </Link>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div style={{ height: "1px", background: "var(--color-border)" }} />

      {/* ── Featured Topics ──────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 6rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--color-saffron)",
              marginBottom: "0.8rem",
            }}
          >
            Begin here
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 400,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Six places to enter the tradition
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "0",
            borderTop: "1px solid var(--color-border)",
            borderLeft: "1px solid var(--color-border)",
          }}
        >
          {getFeaturedTopics().map((topic) => (
            <Link
              key={topic.id}
              href={`/ontology/${topic.id}`}
              style={{
                display: "block",
                padding: "2rem 1.8rem",
                borderRight: "1px solid var(--color-border)",
                borderBottom: "1px solid var(--color-border)",
                textDecoration: "none",
                background: "var(--color-surface)",
                transition: "background 0.2s",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  margin: "0 0 0.5rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {topic.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-source-serif), Georgia, serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--color-ink-muted)",
                  margin: 0,
                }}
              >
                {topic.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── The Three Pillars ───────────────────────────── */}
      <section
        style={{
          background: "var(--color-surface-alt)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3rem",
            }}
          >

            {[
              {
                kicker: "Philosophy",
                heading: "What Jainism holds to be true",
                body: "The soul is eternal. Reality is many-sided. Every living being is of infinite worth. These are not articles of faith but logical conclusions, reasoned across two and a half millennia.",
                href: "/ontology/D03.T001",
                linkLabel: "Ontology & Metaphysics",
              },
              {
                kicker: "Practice",
                heading: "What Jainism asks of its practitioners",
                body: "Non-violence is the first and highest vow. But Jainism also asks for truthfulness, non-stealing, celibacy, and non-possessiveness — each elaborated across centuries of practical commentary.",
                href: "/ontology/D13.T001",
                linkLabel: "The Five Vows",
              },
              {
                kicker: "Scripture",
                heading: "What Jainism has preserved in writing",
                body: "The canon spans the Agamas of the Śvetāmbara, the works of Kundakunda, the Tattvārthasūtra of Umāsvāmi, and thousands of manuscripts whose full scope is still being catalogued.",
                href: "/ontology/D31.T001",
                linkLabel: "Jain Literature",
              },
            ].map((pillar) => (
              <div key={pillar.kicker}>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-saffron)",
                    marginBottom: "0.8rem",
                  }}
                >
                  {pillar.kicker}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.6rem",
                    fontWeight: 400,
                    lineHeight: 1.25,
                    color: "var(--color-ink)",
                    marginBottom: "1rem",
                  }}
                >
                  {pillar.heading}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-source-serif), Georgia, serif",
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    color: "var(--color-ink-muted)",
                    marginBottom: "1.4rem",
                  }}
                >
                  {pillar.body}
                </p>
                <Link
                  href={pillar.href}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    color: "var(--color-saffron)",
                    textDecoration: "none",
                    borderBottom: "1px solid currentColor",
                    paddingBottom: "1px",
                  }}
                >
                  {pillar.linkLabel} ›
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ───────────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "var(--color-ink)",
              margin: "0 0 1.5rem",
            }}
          >
            "The soul is the architect of its own liberation and its own bondage."
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-ink-faint)",
            }}
          >
            Tattvārthasūtra — Umāsvāmi
          </p>
        </div>
      </section>

    </div>
  );
}
