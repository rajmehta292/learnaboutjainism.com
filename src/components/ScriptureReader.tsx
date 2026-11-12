"use client";
import React, { useState } from 'react';

type ScriptureSegment = {
  id: string;
  original?: string;
  transliteration?: string;
  translationEn?: string;
};

interface ScriptureReaderProps {
  title: string;
  author?: string;
  notes?: string;
  segments: ScriptureSegment[];
  reviewed?: boolean;
  sourceUrl?: string;
  edition?: string;
  locator?: string;
  reviewedBy?: string;
  reviewedOn?: string;
}

type View = 'translation' | 'original' | 'transliteration';

export default function ScriptureReader({
  title,
  author,
  notes,
  segments,
  reviewed = false,
  sourceUrl,
  edition,
  locator,
  reviewedBy,
  reviewedOn,
}: ScriptureReaderProps) {
  const hasOriginal = segments.some(s => s.original && s.original.trim());
  const hasTranslit = segments.some(s => s.transliteration && s.transliteration.trim());

  const availableViews: View[] = ['translation'];
  if (hasOriginal) availableViews.push('original');
  if (hasTranslit) availableViews.push('transliteration');

  const [activeView, setActiveView] = useState<View>('translation');

  const viewLabels: Record<View, string> = {
    translation: 'Translation',
    original: 'Original Script',
    transliteration: 'Transliteration',
  };

  const hasVerifiedSource = Boolean(
    reviewed &&
      sourceUrl?.startsWith("https://") &&
      edition?.trim() &&
      locator?.trim() &&
      reviewedBy?.trim() &&
      reviewedOn &&
      /^\d{4}-\d{2}-\d{2}$/.test(reviewedOn),
  );

  if (!hasVerifiedSource) {
    return (
      <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div style={{ padding: "1.25rem 1.5rem" }}>
          <p style={{ margin: "0 0 0.4rem", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.2rem", color: "var(--color-ink)" }}>
            {title}
          </p>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
            This passage is awaiting review against a specific edition and location. The quotation,
            transliteration, and translation are withheld until that check is recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "1.25rem 1.5rem 0",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "var(--color-ink)",
              margin: "0 0 0.2rem",
              lineHeight: 1.3,
            }}
          >
            {title}
          </p>
          {author && (
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                color: "var(--color-ink-faint)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {author}
            </p>
          )}
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.68rem", color: "var(--color-leaf)", margin: "0.45rem 0 0" }}>
            Reviewed {reviewedOn} by {reviewedBy} · {edition} · {locator}
          </p>
          <p style={{ margin: "0.4rem 0 0", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.68rem" }}>
            <a href={sourceUrl} target="_blank" rel="noreferrer" style={{ color: "var(--color-saffron)" }}>
              View the cited source
            </a>
          </p>
        </div>

        {/* View tabs — only show if there's more than one view */}
        {availableViews.length > 1 && (
          <div style={{ display: "flex", gap: "0" }}>
            {availableViews.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderBottom: activeView === view
                    ? "2px solid var(--color-saffron)"
                    : "2px solid transparent",
                  background: "transparent",
                  color: activeView === view ? "var(--color-saffron)" : "var(--color-ink-faint)",
                  cursor: "pointer",
                  transition: "color 0.15s",
                  marginBottom: "-1px",
                }}
              >
                {viewLabels[view]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem" }}>
        {segments.map((segment) => {
          const content =
            activeView === 'original'       ? segment.original :
            activeView === 'transliteration' ? segment.transliteration :
            segment.translationEn;

          if (!content || !content.trim()) return null;

          return (
            <p
              key={segment.id}
              dir={activeView === 'original' ? 'auto' : 'ltr'}
              style={{
                fontFamily: activeView === 'translation'
                  ? "var(--font-source-serif), Georgia, serif"
                  : activeView === 'original'
                  ? "'Noto Serif Devanagari', var(--font-source-serif), Georgia, serif"
                  : "var(--font-source-serif), Georgia, serif",
                fontSize: activeView === 'original' ? "1.25rem" : "1rem",
                lineHeight: activeView === 'original' ? 1.9 : 1.85,
                fontStyle: activeView === 'transliteration' ? 'italic' : 'normal',
                color: activeView === 'translation' ? "var(--color-ink)" : "var(--color-ink-muted)",
                margin: 0,
              }}
            >
              {content}
            </p>
          );
        })}
      </div>

      {/* Notes — as marginalia */}
      {notes && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "1rem 1.5rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-saffron)",
              paddingTop: "2px",
              whiteSpace: "nowrap",
            }}
          >
            Note
          </span>
          <p
            style={{
              fontFamily: "var(--font-source-serif), Georgia, serif",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              color: "var(--color-ink-muted)",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}
