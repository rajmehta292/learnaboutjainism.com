import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import EditorialNotice from "@/components/EditorialNotice";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

const description =
  "Explore Jainism through beginner reading paths, clear explanations of key ideas, and notes on differences across Jain communities as sources are reviewed.";

export const metadata: Metadata = {
  title: "A careful beginning to a living tradition",
  description,
  alternates: { canonical: "/en" },
  openGraph: {
    title: "A careful beginning to a living tradition",
    description,
    url: "/en",
    siteName: "Learn About Jainism",
    type: "website",
    images: openGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "A careful beginning to a living tradition",
    description,
    images: twitterImages,
  },
};

const firstQuestions = [
  {
    id: "D01.T001",
    title: "What Jainism is",
    description: "Begin with the language and frame of the tradition, then follow the topics that interest you.",
    number: "01",
  },
  {
    id: "D13.T002",
    title: "Ahimsa",
    description: "Explore a widely recognized Jain ethical idea and the questions it raises about everyday life.",
    number: "02",
  },
  {
    id: "D01.T005",
    title: "Diversity within Jainism",
    description: "Keep differences among communities in view as you read about shared ideas and practices.",
    number: "03",
  },
  {
    id: "D02.T001",
    title: "Moksha",
    description: "Meet a central idea about liberation and trace its connections to ethics and knowledge.",
    number: "04",
  },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="site-container home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow">Learn About Jainism <span>·</span> English edition</p>
            <h1>A careful beginning<br />to a living tradition.</h1>
            <p className="home-hero__lead">
              Explore Jain ideas, communities, texts, and practices at your own pace. Start with a
              question, notice where accounts differ, and follow the sources as they are reviewed.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/start-here">Start with a question</Link>
              <Link className="button button--outline" href="/ontology">Browse the library</Link>
            </div>
          </div>

          <aside className="home-hero__guide" aria-label="How to use the library">
            <p className="eyebrow">A reader’s guide</p>
            <ol>
              <li>
                <span className="home-hero__step">01</span>
                <span><strong>Choose an idea</strong><small>Begin with a short topic or reading path.</small></span>
              </li>
              <li>
                <span className="home-hero__step">02</span>
                <span><strong>Notice the tradition</strong><small>Some teachings and practices vary by community.</small></span>
              </li>
              <li>
                <span className="home-hero__step">03</span>
                <span><strong>Check the evidence</strong><small>Look for edition details and an exact source location.</small></span>
              </li>
            </ol>
            <Link className="home-hero__guide-link" href="/about-this-library">
              About sources and review <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>

      <div className="site-container home-status">
        <EditorialNotice />
      </div>

      <section className="site-container section-block" aria-labelledby="first-questions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Begin here</p>
            <h2 id="first-questions-title">Four useful first questions</h2>
          </div>
          <Link className="text-link" href="/start-here">See reading paths <span aria-hidden="true">→</span></Link>
        </div>

        <div className="question-grid">
          {firstQuestions.map((question) => (
            <Link className="question-card" href={`/ontology/${question.id}`} key={question.id}>
              <span className="question-card__number">{question.number}</span>
              <h3>{question.title}</h3>
              <p>{question.description}</p>
              <span className="question-card__action">Read the draft <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-pathways">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ways to explore</p>
              <h2>Read by subject, source, or practice</h2>
            </div>
            <p className="section-heading__note">Move between a topic and the questions around it.</p>
          </div>
          <div className="pathway-grid">
            <Link className="pathway-card" href="/ontology">
              <span className="pathway-card__index">01 / Catalogue</span>
              <h3>The topic library</h3>
              <p>Search across philosophy, ethics, history, literature, and more.</p>
              <span className="pathway-card__action">Open the library <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="pathway-card" href="/aradhana">
              <span className="pathway-card__index">02 / Ārādhana</span>
              <h3>Texts and observances</h3>
              <p>Read about selected prayers and observances, with differences in practice kept visible.</p>
              <span className="pathway-card__action">Explore practice pages <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="pathway-card" href="/about-this-library">
              <span className="pathway-card__index">03 / Editorial method</span>
              <h3>How this library is reviewed</h3>
              <p>See what a draft label means, what counts as a citation, and how the collection is growing.</p>
              <span className="pathway-card__action">Read the method <span aria-hidden="true">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container home-closing">
        <p className="eyebrow">A growing study resource</p>
        <h2>Depth comes from careful reading, not from a longer list.</h2>
        <p>
          The catalogue is a starting map. Each entry needs source details, tradition notes, and
          human review before it can serve as a reliable reference.
        </p>
        <Link className="text-link" href="/about-this-library">See the current review standard <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
