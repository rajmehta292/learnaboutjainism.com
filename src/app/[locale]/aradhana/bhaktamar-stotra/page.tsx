import Link from "next/link";

export const metadata = {
  title: "Bhaktamar Stotra",
};

export default function BhaktamarStotraPage() {
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
          Bhaktamar Stotra
        </h1>

        <p
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.2rem",
            color: "var(--color-night-muted)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
          }}
        >
          The Bhaktamar Stotra is arguably the most famous and widely recited Sanskrit hymn in Jainism. Composed by Acharya Manatunga, it is dedicated to the first Tirthankara, Lord Rishabhanatha (Adinath).
        </p>
        <p
          style={{
            fontFamily: "var(--font-source-serif)",
            fontSize: "1.2rem",
            color: "var(--color-night-muted)",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          The complete stotra contains 48 verses (Digambara tradition) or 44 verses (Svetambara tradition). Due to its length, many practitioners recite it fully during special rituals or morning devotions, while focusing on selected key verses for daily reflection.
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
          {/* Selected Verses */}
          
          <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "var(--color-night-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>Verse 1</h3>
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              भक्तामर-प्रणत-मौल-मणि-प्रभाणा-<br />
              मुद्योतकं दलित-पाप-तमोवितानम् ।<br />
              सम्यक् प्रणम्य जिन-पाद-युगं युगादा-<br />
              वालम्बनं भव-जले पततां जनानाम् ॥१॥
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", color: "var(--color-night-muted)", lineHeight: 1.8, letterSpacing: "0.05em", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              Bhaktāmara-pranata-mauli-maṇi-prabhānām-<br />
              udyotakam dalita-pāpa-tamo-vitānam;<br />
              Samyak praṇamya Jina-pāda-yugam yugādā-<br />
              vālambanam bhava-jale patatām janānām.
            </p>
            <p style={{ fontFamily: "var(--font-source-serif)", fontSize: "1.1rem", color: "var(--color-night-ink)", lineHeight: 1.8, margin: 0 }}>
              Having perfectly bowed down to the pair of feet of the Jina, which are illuminated by the light of the gems on the crowns of the bowing gods, which destroy the dense darkness of sins, and which are the ultimate support for people falling in the ocean of worldly existence at the beginning of this era...
            </p>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--color-night-border)", margin: "3rem auto", width: "50%" }} />

          <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "var(--color-night-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>Verse 7</h3>
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              त्वत्संस्तवेन भव-सन्तति-सन्निबद्धं<br />
              पापं क्षणात्क्षयमुपैति शरीरभाजाम् ।<br />
              आक्रान्त-लोक-मलि-नीलमशेष-माशु<br />
              सूर्यांशु-भिन्नमिव शार्वर-मन्धकारम् ॥७॥
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", color: "var(--color-night-muted)", lineHeight: 1.8, letterSpacing: "0.05em", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              Tvat-samstavena bhava-santati-sannibaddham<br />
              pāpam kshaṇāt kshayam-upaiti śarīrabhājām;<br />
              Ākrānta-loka-mali-nīlamaśeṣa-māśu<br />
              sūryāmśu-bhinnamiva śārvara-mandhakāram.
            </p>
            <p style={{ fontFamily: "var(--font-source-serif)", fontSize: "1.1rem", color: "var(--color-night-ink)", lineHeight: 1.8, margin: 0 }}>
              By singing your praise, the sins of embodied beings accumulated over a continuous succession of births are destroyed in an instant, just as the deep, black darkness pervading the whole world is quickly dispelled by the rays of the sun.
            </p>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--color-night-border)", margin: "3rem auto", width: "50%" }} />

          <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "var(--color-night-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>Verse 48</h3>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              स्तोत्रस्रजं तव जिनेन्द्र ! गुणैर्निबद्धाम्,<br />
              भक्त्या मया रुचिर-वर्ण-विचित्र-पुष्पाम् ।<br />
              धत्ते जनो य इह कण्ठगतामजस्रम्,<br />
              तं मानतुंग-मवशा समुपैति लक्ष्मीः ॥४८॥
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", color: "var(--color-night-muted)", lineHeight: 1.8, letterSpacing: "0.05em", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              Stotrasrajam tava Jinendra ! gunair-nibaddhām,<br />
              bhaktyā mayā ruchira-varna-vichitra-pushpām;<br />
              Dhatte jano ya iha kantha-gatām-ajasram,<br />
              tam mānatunga-mavaśā samupaiti lakshmīh.
            </p>
            <p style={{ fontFamily: "var(--font-source-serif)", fontSize: "1.1rem", color: "var(--color-night-ink)", lineHeight: 1.8, margin: 0 }}>
              O Lord of Jinas! This garland of praise, woven by me with devotion using the colorful flowers of beautiful letters (and your virtues) – whoever wears it continuously on their neck (i.e., recites it constantly), to that highly esteemed person, spiritual wealth comes naturally and inevitably.
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
          Spiritual Significance
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
          According to tradition, Acharya Manatunga was imprisoned and bound by forty-eight heavy chains by King Harsha. As he composed and recited each verse of this stotra with pure devotion, one chain broke. By the forty-eighth verse, he was completely free. 
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
          Metaphorically, the Bhaktamar Stotra is understood by practitioners as a means to break the "chains" of karmic bondage. The stotra teaches that true devotion (bhakti) is not about asking the Tirthankara for release, but rather that the act of pure devotion itself purifies the soul and naturally shatters karmic constraints.
        </p>

      </div>
    </main>
  );
}
