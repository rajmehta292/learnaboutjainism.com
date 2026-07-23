export const metadata = {
  title: "Khamemi Savva Jive",
};

export default function KhamemiSavvaJivePage() {
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
          Khamemi Savva Jive
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
          The <em>Khamemi Savva Jive</em> is the universal Jain prayer of forgiveness. It is recited daily as the culmination of Pratikraman (the ritual of introspection), and it forms the core of the annual observance of Samvatsari, when Jains seek forgiveness from all living beings by saying <em>Micchami Dukkadam</em>.
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
              खामेमि सव्वे जीवा,<br />
              सव्वे जीवा खमंतु मे ।<br />
              मित्ती मे सव्व-भूएसु,<br />
              वेरं मज्झं न केणइ ॥
            </p>
          </div>

          {/* Transliteration */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", color: "var(--color-night-muted)", lineHeight: 1.8, letterSpacing: "0.05em", margin: 0 }}>
              Khamemi savve jīvā,<br />
              Savve jīvā khamantu me;<br />
              Mittī me savva-bhūesu,<br />
              Veram majjham na keṇai.
            </p>
          </div>

          {/* English Meaning */}
          <div>
            <p style={{ fontFamily: "var(--font-source-serif)", fontSize: "1.2rem", color: "var(--color-night-ink)", lineHeight: 1.8, margin: 0 }}>
              I forgive all living beings,<br />
              May all living beings forgive me.<br />
              My friendship is with all living beings,<br />
              My enmity is with none.
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
          Significance in Daily Practice
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
          In Jainism, resentment, anger, and holding grudges are forms of violence (<i>himsa</i>) inflicted upon one's own soul, binding it tightly with negative karma. <i>Khamemi Savva Jive</i> is the antidote to this. It is an active, daily unburdening.
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
          Notice the sequence of the prayer: <strong>"I forgive all living beings"</strong> comes first. The practitioner must first release their own anger before asking others to do the same. This verse establishes that true peace begins internally, by ensuring that one's <i>"enmity is with none."</i> It is a profound psychological and spiritual practice that resets the mind to a state of equanimity and compassion.
        </p>

      </div>
    </main>
  );
}
