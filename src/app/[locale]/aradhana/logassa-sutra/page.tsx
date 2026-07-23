export const metadata = {
  title: "Logassa Sutra",
};

export default function LogassaSutraPage() {
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
          Logassa Sutra
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
          The Logassa Sutra (also known as the Chaturvimshatistava) is one of the most essential prayers in Jainism. It is a hymn of praise dedicated to the twenty-four Tirthankaras of the current time cycle. It forms an integral part of the daily Pratikraman ritual and is also frequently recited independently for spiritual reflection and peace.
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
          {/* Prakrit Original - Selected/Full */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              लोगस्स उज्जोअगरे, धम्मतित्थयरे जिणे ।<br />
              अरिहंते कित्तइस्सं, चउवीसं पि केवली ॥१॥
            </p>
            <br />
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", color: "var(--color-night-muted)", lineHeight: 1.8, margin: 0 }}>
              उसभमजियं च वंदे, संभव-मभिणंदणं च सुमइं च ।<br />
              पउमप्पहं सुपासं, जिणं च चंदप्पहं वंदे ॥२॥<br />
              सुविहिं च पुप्फदंतं, सीअल-सिज्जंस-वासुपुज्जं च ।<br />
              विमलमणंतं च जिणं, धम्मं संतिं च वंदामि ॥३॥<br />
              कुंथुं अरं च मल्लिं, वंदे मुणिसुव्वयं नमिजिणं च ।<br />
              वंदामि रिट्ठणेमिं, पासं तह वद्धमाणं च ॥४॥
            </p>
            <br />
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              एवं मए अभित्थुआ, विहुय-रयमला पहीण-जर-मरणा ।<br />
              चउवीसं पि जिणवरा, तित्थयरा मे पसीयंतु ॥५॥
            </p>
            <br />
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              कित्तिय-वंदिय-महिया, जे ए लोगस्स उत्तमा सिद्धा ।<br />
              आरुग्ग-बोहिलाभं, समाहिवर-मुत्तमं दिंतु ॥६॥
            </p>
            <br />
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", color: "var(--color-saffron)", lineHeight: 1.8, margin: 0 }}>
              चंदेसु निम्मलयरा, आइच्चेसु अहियं पयासयरा ।<br />
              सागर-वर-गंभीरा, सिद्धा सिद्धिं मम दिसंतु ॥७॥
            </p>
          </div>

          {/* Transliteration */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", color: "var(--color-night-muted)", lineHeight: 1.8, letterSpacing: "0.05em", margin: 0 }}>
              Logassa ujjoagare, dhamma-titthayare jine;<br />
              Arihante kittayissam, chauvīsam pi kevalī. (1)<br />
              <br />
              Usabham-ajiyam cha vande, Sambhavam-abhinandanam cha Sumaim cha;<br />
              Paumappaham Supāsam, Jinam cha Chandappaham vande. (2)<br />
              Suvihim cha Pupphadantam, Sīala-Sijjamsa-Vāsupujjam cha;<br />
              Vimalam-anantam cha Jinam, Dhammam Santim cha vandāmi. (3)<br />
              Kunthum Aram cha Mallim, vande Munisuvvayam Nami-jinam cha;<br />
              Vandāmi Ritthanemim, Pāsam taha Vaddhamānam cha. (4)<br />
              <br />
              Evam mae abhithuā, vihuya-rayamalā pahīna-jara-maranā;<br />
              Chauvīsam pi jinavarā, titthayarā me pasīyantu. (5)<br />
              <br />
              Kittiya-vandiya-mahiyā, je e logassa uttamā Siddhā;<br />
              Ārugga-bohilābham, samāhivar-muttamam dintu. (6)<br />
              <br />
              Chandesu nimmalayarā, āicchesu ahiyam payāsayarā;<br />
              Sāgara-vara-gambhirā, Siddhā siddhim mama disantu. (7)
            </p>
          </div>

          {/* English Meaning */}
          <div>
            <p style={{ fontFamily: "var(--font-source-serif)", fontSize: "1.1rem", color: "var(--color-night-ink)", lineHeight: 1.8, margin: 0 }}>
              Oh, Illuminators of the universe, founders of the religious path, and conquerors of inner enemies!<br />
              I praise the twenty-four Tirthankaras and the omniscient beings. (1)<br />
              <br />
              <em>[Verses 2-4 systematically bow to and name all twenty-four Tirthankaras from Rishabhanatha to Mahavira]</em><br />
              <br />
              Thus, having praised the Tirthankaras, who are free from karmic dust and have conquered old age and death,<br />
              May all the twenty-four supreme Jinas be pleased with me. (5)<br />
              <br />
              May those who are praised, bowed to, and worshipped, the supreme Siddhas in the universe,<br />
              Bestow upon me the spiritual health, the benefit of right knowledge, and the highest state of contemplation. (6)<br />
              <br />
              Purer than the moon, more radiant than the sun,<br />
              And deeper than the ocean; may the Siddhas grant me liberation. (7)
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
          The Logassa Sutra operates on two levels: historical remembrance and spiritual aspiration. By reciting the names of the twenty-four Tirthankaras, practitioners root themselves in the Jain spiritual lineage. But the core purpose of the prayer, as revealed in its final verses, is not to ask these historical figures for material favors.
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
          Instead, the practitioner asks for "Bodhilabham" (the attainment of right perception) and "Samadhi" (equanimity). The prayer concludes by aspiring to the qualities of the Siddhas—purity, radiance, and depth—seeking the ultimate goal of liberation (Siddhi).
        </p>

      </div>
    </main>
  );
}
