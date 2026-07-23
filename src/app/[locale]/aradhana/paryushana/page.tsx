export const metadata = {
  title: "Paryushana & Das Lakshana",
};

export default function ParyushanaPage() {
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
          Paryushana & Das Lakshana
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
          Paryushana (observed in Svetambara traditions) and Das Lakshana (observed in Digambara traditions) constitute the most important annual festival period in Jainism. Unlike many religious festivals centered on celebration or historical events, this period is dedicated to intense spiritual purification, fasting, scriptural study, and forgiveness.
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
          Observance in the Traditions
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
          The festival takes place during the rainy season (Chaturmas), a time when Jain monastics traditionally suspend travel to avoid harming the multitude of insects that emerge during the rains. Laypeople use this time to live more closely to the monastic ideal.
        </p>

        <p
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.1rem",
            color: "var(--color-night-ink)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
          }}
        >
          <strong>Svetambara Paryushana:</strong> Typically lasts eight days. It is marked by fasting (of varying intensities), the daily reading of the Kalpa Sutra (which recounts the lives of the Tirthankaras), and an emphasis on introspection. The final day is Samvatsari, the day of universal forgiveness.
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
          <strong>Digambara Das Lakshana:</strong> Typically lasts ten days, beginning immediately after the Svetambara observance concludes. It focuses on the Ten Universal Virtues (Supreme Forgiveness, Humility, Straightforwardness, Contentment, Truth, Self-Restraint, Penance, Renunciation, Non-Attachment, and Celibacy). The primary text read during this period is often the Tattvartha Sutra.
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
          Micchami Dukkadam
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
          The culmination of this period is the request for forgiveness. Jains reach out to family, friends, and even those they have conflict with, saying "Micchami Dukkadam." This Prakrit phrase translates roughly to "May all the evil that has been done be fruitless" or "I ask your forgiveness for any hurt I have caused you, knowingly or unknowingly."
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
          It is not merely a social pleasantry but a deeply serious spiritual practice designed to shed the heavy karmic burdens associated with anger, ego, and resentment.
        </p>

      </div>
    </main>
  );
}
