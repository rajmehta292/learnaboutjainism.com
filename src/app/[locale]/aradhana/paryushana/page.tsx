import type { Metadata } from "next";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Paryushana and Das Lakshana",
  description: "A source-aware introduction to two Jain annual observance periods and their community-specific forms.",
};

export default function ParyushanaPage() {
  return (
    <main className="practice-page" id="main-content">
      <p className="eyebrow">Ārādhana · Annual observances</p>
      <h1>Paryushana and Das Lakshana</h1>
      <p className="practice-page__lead">
        Jainpedia describes Paryuṣaṇa as associated with Śvetāmbara communities and Daśa-lakṣaṇa
        with Digambara communities. Jain festivals and calendars vary by tradition and locality, so
        this overview is not a universal calendar or ritual manual.
      </p>

      <aside className="practice-warning">
        This page does not recommend fasting or give a fasting plan. The form and meaning of an
        observance should be learned from the relevant Jain community and qualified teachers.
      </aside>

      <section>
        <h2>Why the details differ</h2>
        <p>
          Jainpedia notes that some festivals are shared while others belong to a particular sect
          or local community, and that different groups may use different festival lists. Dates are
          tied to Jain lunar calendars. Confirm current dates and local practice with the community
          whose observance you are studying.
        </p>
        <p>
          Published introductions often mention reflection, religious study, forgiveness, and
          fasting among observance practices. Those descriptions are context, not instructions for
          an individual. This site does not advise whether, when, or for how long a person should
          fast.
        </p>
      </section>

      <section>
        <h2>Further reading</h2>
        <ul className="practice-references">
          <li>
            <a href="https://jainpedia.org/article/themes/practices/festivals/" target="_blank" rel="noreferrer">
              “Festivals,” Jainpedia
            </a>
            <span>A tradition-aware overview of Jain festivals and calendar variation.</span>
          </li>
          <li>
            <a href="https://parliamentofreligions.org/articles/introspection-and-forgiveness-the-jain-celebration-of-paryushan-and-das-lakshan/" target="_blank" rel="noreferrer">
              “Introspection and Forgiveness: The Jain Celebration of Paryushan and Das Lakshan,” Parliament of the World’s Religions
            </a>
            <span>A short community-facing introduction; local calendars and observance may differ.</span>
          </li>
        </ul>
      </section>

      <p className="practice-page__closing">
        Dates, transliterations, translations, and descriptions of local observance are still being
        reviewed for this page. See the <Link href="/about-this-library">editorial method</Link> for what
        a completed source review requires.
      </p>
    </main>
  );
}
