import React from 'react';
import fs from 'fs';
import path from 'path';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Library',
  description: 'Browse 1,676 topics across 52 knowledge domains — Jain philosophy, history, scripture, cosmology, and practice.',
};

// Domain groupings for visual organisation
const DOMAIN_GROUPS: Record<string, string[]> = {
  "Doctrine & Philosophy": ["D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12"],
  "Practice & Ethics":     ["D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22"],
  "History & Community":   ["D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30"],
  "Scripture & Literature":["D31", "D32", "D33", "D34", "D35", "D36", "D37"],
  "Arts, Science & Culture":["D38", "D39", "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48"],
  "Research & Reference":  ["D49", "D50", "D51", "D52"],
};

export default async function LibraryPage() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'ontology.json');
  const ontology = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Index domains by domain_id prefix for fast lookup
  const domainMap: Record<string, any[]> = {};
  for (const domain of ontology.domains) {
    const prefix = domain.domain_id; // e.g. "D01"
    domainMap[prefix] = domainMap[prefix] || [];
    domainMap[prefix].push(domain);
  }

  return (
    <main>

      {/* ── Library Header ───────────────────────────── */}
      <section
        style={{
          background: "var(--color-night)",
          padding: "5rem 1.5rem 4rem",
          borderBottom: "1px solid var(--color-night-border)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-saffron)",
              marginBottom: "1.4rem",
            }}
          >
            {ontology.topic_count} topics · {ontology.domain_count} domains
          </p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 300,
              color: "var(--color-night-ink)",
              marginBottom: "1.4rem",
              lineHeight: 1.1,
            }}
          >
            The Library
          </h1>
          <p
            style={{
              fontFamily: "var(--font-source-serif), Georgia, serif",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--color-night-muted)",
              maxWidth: "580px",
            }}
          >
            Every topic in this library draws on identifiable scholarly and scriptural sources.
            Click any subject to read the full entry. Hover over highlighted terms on any page
            to see a definition without leaving your place.
          </p>
        </div>
      </section>

      {/* ── Domain Groups ─────────────────────────────── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {Object.entries(DOMAIN_GROUPS).map(([groupLabel, domainPrefixes]) => {
          // Collect all domains in this group
          const groupDomains = domainPrefixes
            .flatMap(prefix => domainMap[prefix] || [])
            .filter(Boolean);

          if (groupDomains.length === 0) return null;

          return (
            <section key={groupLabel} style={{ marginBottom: "4rem" }}>

              {/* Group heading */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "0.75rem",
                  marginBottom: "2rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "var(--color-ink)",
                    margin: 0,
                  }}
                >
                  {groupLabel}
                </h2>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-ink-faint)",
                  }}
                >
                  {groupDomains.reduce((sum: number, d: any) => sum + d.topics.length, 0)} topics
                </span>
              </div>

              {/* Domains within group */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {groupDomains.map((domain: any) => (
                  <details
                    key={domain.domain_id}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        padding: "1.1rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        listStyle: "none",
                        userSelect: "none",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--color-ink-faint)",
                          }}
                        >
                          {domain.domain_id}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-cormorant), Georgia, serif",
                            fontSize: "1.15rem",
                            color: "var(--color-ink)",
                          }}
                        >
                          {domain.domain}
                        </span>
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.72rem",
                          color: "var(--color-saffron)",
                        }}
                      >
                        {domain.topics.length} topics ›
                      </span>
                    </summary>

                    {/* Topic grid */}
                    <div
                      style={{
                        borderTop: "1px solid var(--color-border)",
                        padding: "1.5rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "0.4rem 2rem",
                      }}
                    >
                      {domain.topics.map((topic: any) => (
                        <Link
                          key={topic.topic_id}
                          href={`/ontology/${topic.topic_id}`}
                          style={{
                            fontFamily: "var(--font-source-serif), Georgia, serif",
                            fontSize: "0.9rem",
                            color: "var(--color-ink-muted)",
                            textDecoration: "none",
                            padding: "0.25rem 0",
                            borderBottom: "1px solid transparent",
                            transition: "color 0.15s",
                            display: "block",
                          }}
                        >
                          {topic.title}
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
