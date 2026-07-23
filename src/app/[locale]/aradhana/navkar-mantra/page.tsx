export const metadata = {
  title: "Navkar Mantra",
};

export default function NavkarMantraPage() {
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
        
        {/* Breadcrumb / Section Header */}
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.85rem",
            color: "var(--color-saffron)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Āradhana
        </p>

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
          Navkar Mantra
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
          The Navkar Mantra (also known as Namaskara Mantra or Namokar Mantra) is the most fundamental prayer in Jainism. Unlike many religious prayers, it does not ask for favors, wealth, or even liberation. It is an obeisance—a deep bow of respect—to souls who have advanced on the spiritual path, regardless of their historical identity.
        </p>

        <div
          style={{
            background: "var(--color-night)",
            border: "1px solid var(--color-night-border)",
            borderRadius: "12px",
            padding: "3rem 2rem",
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          {/* Prakrit Original */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              णमो अरिहंताणं<br />
              णमो सिद्धाणं<br />
              णमो आयरियाणं<br />
              णमो उवज्झायाणं<br />
              णमो लोए सव्वसाहूणं
            </p>
          </div>

          {/* Transliteration */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "var(--color-night-muted)", lineHeight: 1.8, letterSpacing: "0.05em", margin: 0 }}>
              Namo Arihantānam<br />
              Namo Siddhānam<br />
              Namo Āyariyānam<br />
              Namo Uvajjhāyānam<br />
              Namo Loe Savva Sāhūnam
            </p>
          </div>

          {/* English Meaning */}
          <div>
            <p style={{ fontFamily: "var(--font-source-serif)", fontSize: "1.1rem", color: "var(--color-night-ink)", lineHeight: 1.8, margin: 0 }}>
              I bow to the Arihants (those who have conquered their inner enemies).<br />
              I bow to the Siddhas (liberated souls).<br />
              I bow to the Acharyas (spiritual leaders).<br />
              I bow to the Upadhyayas (spiritual teachers).<br />
              I bow to all the Sadhus and Sadhvis (monks and nuns) in the universe.
            </p>
          </div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2rem",
            color: "var(--color-night-ink)",
            fontWeight: 400,
            marginBottom: "1rem",
            marginTop: "3rem",
          }}
        >
          Significance and Universality
        </h2>

        <p
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.1rem",
            color: "var(--color-night-ink)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
          }}
        >
          The mantra is universal within Jainism. It is recited across all sects and traditions. The focus is entirely on qualities rather than personalities. By bowing to the <i>Arihants</i> (those who have destroyed their inner passions like anger, ego, deceit, and greed), the practitioner is reminded of the ultimate goal of the Jain path: the purification of their own soul.
        </p>

        <p
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.1rem",
            color: "var(--color-night-ink)",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          It is traditionally the first prayer taught to children and is recited at the beginning of rituals, before study, or quietly in moments of daily reflection.
        </p>

      </div>
    </main>
  );
}
