import React from 'react';
import fs from 'fs';
import path from 'path';
import { Link } from '@/i18n/routing';
import SmartLinker from '@/components/SmartLinker';
import ScriptureReader from '@/components/ScriptureReader';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ topic_id: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic_id } = await params;
  const ontologyPath = path.join(process.cwd(), 'src', 'data', 'ontology.json');
  let title = topic_id;
  let description = '';

  if (fs.existsSync(ontologyPath)) {
    const ontology = JSON.parse(fs.readFileSync(ontologyPath, 'utf8'));
    for (const domain of ontology.domains) {
      const found = domain.topics.find((t: any) => t.topic_id === topic_id);
      if (found) { title = found.title; break; }
    }
  }

  const topicPath = path.join(process.cwd(), 'src', 'data', 'topics', `${topic_id}.json`);
  if (fs.existsSync(topicPath)) {
    const data = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
    if (data.overview) description = data.overview.slice(0, 160);
  }

  return { title, description };
}

export default async function TopicPage({ params }: PageProps) {
  const { topic_id } = await params;

  // Look up topic metadata from ontology
  const ontologyPath = path.join(process.cwd(), 'src', 'data', 'ontology.json');
  let title = "Unknown Topic";
  let domainName = "";
  let domainId = "";

  if (fs.existsSync(ontologyPath)) {
    const ontology = JSON.parse(fs.readFileSync(ontologyPath, 'utf8'));
    for (const domain of ontology.domains) {
      const found = domain.topics.find((t: any) => t.topic_id === topic_id);
      if (found) {
        title = found.title;
        domainName = domain.domain;
        domainId = domain.domain_id;
        break;
      }
    }
  }

  // Read topic content
  const filePath = path.join(process.cwd(), 'src', 'data', 'topics', `${topic_id}.json`);

  if (!fs.existsSync(filePath)) {
    return (
      <main style={{ maxWidth: "740px", margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-saffron)", marginBottom: "1.5rem" }}>
          {domainName}
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "2.8rem", fontWeight: 300, marginBottom: "2rem" }}>{title}</h1>
        <p style={{ fontFamily: "var(--font-source-serif), Georgia, serif", color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
          This entry is being prepared. The full text will appear here shortly.
        </p>
        <div style={{ marginTop: "3rem" }}>
          <Link href="/ontology" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "var(--color-saffron)", textDecoration: "none", borderBottom: "1px solid currentColor" }}>
            ← Return to the Library
          </Link>
        </div>
      </main>
    );
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Split overview into paragraphs
  const paragraphs = (data.overview || '')
    .split('\n')
    .filter((p: string) => p.trim().length > 0);

  return (
    <main>

      {/* ── Topic Header ─────────────────────────────── */}
      <section
        style={{
          background: "var(--color-night)",
          padding: "4rem 1.5rem 3.5rem",
          borderBottom: "1px solid var(--color-night-border)",
        }}
      >
        <div style={{ maxWidth: "740px", margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav style={{ marginBottom: "1.8rem" }}>
            <Link
              href="/ontology"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-saffron)",
                textDecoration: "none",
              }}
            >
              ← The Library
            </Link>
            {domainName && (
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-night-muted)",
                  marginLeft: "0.75rem",
                }}
              >
                · {domainName}
              </span>
            )}
          </nav>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: "var(--color-night-ink)",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>
      </section>

      {/* ── Overview ─────────────────────────────────── */}
      <section style={{ maxWidth: "740px", margin: "0 auto", padding: "3.5rem 1.5rem 0" }}>
        {paragraphs.map((paragraph: string, i: number) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-source-serif), Georgia, serif",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              color: "var(--color-ink)",
              marginBottom: "1.5em",
              ...(i === 0
                ? {
                    fontSize: "1.12rem",
                    fontWeight: 300,
                    color: "var(--color-ink)",
                  }
                : {}),
            }}
          >
            <SmartLinker text={paragraph} currentTopicId={topic_id} />
          </p>
        ))}
      </section>

      {/* ── Primary Sources ───────────────────────────── */}
      {data.primary_sources && data.primary_sources.length > 0 && (
        <section style={{ maxWidth: "740px", margin: "0 auto", padding: "3rem 1.5rem 0" }}>
          <div
            style={{
              borderTop: "1px solid var(--color-border)",
              paddingTop: "2.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-saffron)",
                marginBottom: "1.5rem",
              }}
            >
              Primary Sources
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {data.primary_sources.map((source: any, i: number) => (
              <ScriptureReader
                key={i}
                title={source.title}
                author={source.author}
                notes={source.notes}
                segments={[
                  {
                    id: '1',
                    original: source.original_text || '',
                    transliteration: source.transliteration,
                    translationEn: source.translation,
                  },
                ]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Misconceptions ───────────────────────────── */}
      {data.misconceptions && data.misconceptions.length > 0 && (
        <section style={{ maxWidth: "740px", margin: "3rem auto 0", padding: "0 1.5rem" }}>
          <div
            style={{
              background: "var(--color-saffron-pale)",
              border: "1px solid var(--color-border)",
              padding: "2rem 2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-saffron)",
                marginBottom: "1.5rem",
              }}
            >
              Common Misunderstandings
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {data.misconceptions.map((misc: any, i: number) => (
                <li key={i}>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontSize: "1.1rem",
                      color: "var(--color-ink)",
                      marginBottom: "0.4rem",
                      fontStyle: "italic",
                    }}
                  >
                    "{misc.myth}"
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-source-serif), Georgia, serif",
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                      color: "var(--color-ink-muted)",
                      margin: 0,
                    }}
                  >
                    {misc.reality}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Footer nav ───────────────────────────────── */}
      <div
        style={{
          maxWidth: "740px",
          margin: "4rem auto 0",
          padding: "2rem 1.5rem 6rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/ontology"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.78rem",
            color: "var(--color-saffron)",
            textDecoration: "none",
            borderBottom: "1px solid currentColor",
          }}
        >
          ← Return to the Library
        </Link>
      </div>
    </main>
  );
}
