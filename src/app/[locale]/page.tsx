import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { englishHref, getMessages } from "@/i18n/messages";
import type { SiteLocale } from "@/i18n/routing";
import { openGraphImages, twitterImages } from "@/lib/socialMetadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMessages(locale).Home;
  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: { canonical: "/en" },
    openGraph: { title: copy.metadataTitle, description: copy.metadataDescription, url: `/${locale}`, siteName: "Learn About Jainism", type: "website", images: openGraphImages },
    twitter: { card: "summary_large_image", title: copy.metadataTitle, description: copy.metadataDescription, images: twitterImages },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: SiteLocale }> }) {
  const { locale } = await params;
  const copy = getMessages(locale).Home;

  return (
    <main id="main-content">
      <section className="home-hero">
        <div className="site-container home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="home-hero__lead">{copy.lead}</p>
            <div className="button-row">
              <Link className="button button--primary" href="/start-here">{copy.startButton}</Link>
              <Link className="button button--outline" href="/ontology">{copy.browseButton}</Link>
            </div>
            <Link className="home-hero__study-link" href="/sign-in">{copy.heroStudyLink} <span aria-hidden="true">→</span></Link>
          </div>

          <aside className="home-hero__guide" aria-label={copy.guideAria}>
            <p className="eyebrow">{copy.guideLabel}</p>
            <ol>
              {copy.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="home-hero__step">{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{step.title}</strong><small>{step.description}</small></span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="site-container section-block" aria-labelledby="first-questions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.questionsEyebrow}</p>
            <h2 id="first-questions-title">{copy.questionsTitle}</h2>
          </div>
          <Link className="text-link" href="/start-here">{copy.pathsLink} <span aria-hidden="true">→</span></Link>
        </div>

        <div className="question-grid">
          {copy.questions.map((question, index) => (
            <Link className="question-card" href={englishHref(locale, `/ontology/${question.id}`)} key={question.id}>
              <span className="question-card__number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{question.title}</h3>
              <p>{question.description}</p>
              <span className="question-card__action">{copy.readTopic} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-pathways">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.pathwaysEyebrow}</p>
              <h2>{copy.pathwaysTitle}</h2>
            </div>
            <p className="section-heading__note">{copy.pathwaysNote}</p>
          </div>
          <div className="pathway-grid">
            {copy.pathways.map((pathway, index) => {
              const href = ["/start-here", "/aradhana", "/ontology"][index];
              return (
                <Link className="pathway-card" href={href} key={pathway.index}>
                  <span className="pathway-card__index">{pathway.index}</span>
                  <h3>{pathway.title}</h3>
                  <p>{pathway.description}</p>
                  <span className="pathway-card__action">{pathway.action} <span aria-hidden="true">→</span></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-study" aria-labelledby="home-study-title">
        <div className="site-container">
          <div className="home-study__intro">
            <div>
              <p className="eyebrow">{copy.studyEyebrow}</p>
              <h2 id="home-study-title">{copy.studyTitle}</h2>
              <p>{copy.studyBody}</p>
            </div>
            <Link className="button button--primary" href="/sign-in">{copy.studyLink}</Link>
          </div>
          <ul className="home-study__features">
            {copy.studyFeatures.map((feature) => (
              <li key={feature.title}>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
