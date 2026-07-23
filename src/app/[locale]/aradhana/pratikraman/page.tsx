export const metadata = {
  title: "Pratikraman",
};

export default function PratikramanPage() {
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
          Pratikraman
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
          Pratikraman (translating roughly to "turning back" or "retreating from transgressions") is a core Jain ritual of repentance and introspection. It is the process of reflecting on one's actions, recognizing faults, seeking forgiveness from all living beings, and resolving not to repeat those faults.
        </p>

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
          The Six Essential Duties (Avashyakas)
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
          Pratikraman is traditionally composed of six essential observances:
        </p>

        <ol
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.1rem",
            color: "var(--color-night-ink)",
            lineHeight: 1.7,
            marginBottom: "3rem",
            paddingLeft: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <li><strong>Samayika:</strong> Attaining a state of equanimity and calm.</li>
          <li><strong>Chauvisantho (Chaturvimshati Stava):</strong> Praising the twenty-four Tirthankaras.</li>
          <li><strong>Vandana:</strong> Offering respect to spiritual teachers (Sadhus and Sadhvis).</li>
          <li><strong>Pratikraman:</strong> The core act of reviewing one's actions and repenting for violations of non-violence and other vows.</li>
          <li><strong>Kayotsarga:</strong> Meditation involving stillness of the body to withdraw from physical attachment.</li>
          <li><strong>Pratyakhyana:</strong> Making formal resolutions (vows) to avoid future transgressions, such as dietary restrictions or periods of fasting.</li>
        </ol>

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
          Forms of Observance
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
          Monastics perform Pratikraman twice daily (morning and evening). For laypeople, observance varies. Some perform it daily, some fortnightly (<em>Pakshi</em>), some every four months (<em>Chaumasi</em>), and many observe the annual Samvatsari Pratikraman at the conclusion of the Paryushana festival.
        </p>

        <div
          style={{
            background: "var(--color-night)",
            border: "1px solid var(--color-night-border)",
            borderRadius: "12px",
            padding: "2rem",
            marginTop: "3rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.95rem",
              color: "var(--color-night-muted)",
              lineHeight: 1.6,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            "I ask pardon of all creatures, may all creatures pardon me. May I have friendship with all beings and enmity with none."
            <br />— The traditional declaration of forgiveness (Micchami Dukkadam) often associated with Pratikraman.
          </p>
        </div>

      </div>
    </main>
  );
}
