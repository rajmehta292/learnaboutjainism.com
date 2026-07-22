import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* The Threshold */}
      <header className="max-w-4xl mx-auto mt-32 mb-24 text-center px-6">
        <h1 className="text-5xl tracking-wide mb-6">Learn About Jainism</h1>
        <p className="text-xl text-quiet-ink font-sans max-w-xl mx-auto leading-relaxed">
          A quiet place to begin, and a deep place to continue.
        </p>
        <p className="text-base text-quiet-ink font-sans mt-6 max-w-xl mx-auto leading-relaxed opacity-80">
          Explore Jain teachings, primary texts, traditions, practices, history, and living communities at your own pace.
        </p>
      </header>

      {/* Choose a Way to Begin (The Courtyard) */}
      <main className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <section className="bg-paper-surface p-10 border border-carved-line rounded-sm transition-colors hover:bg-marble-canvas">
            <h2 className="text-2xl mb-4 text-temple-ink">I want to explore the teachings</h2>
            <p className="text-quiet-ink font-sans mb-8 leading-relaxed">
              Begin with the foundational concepts of Ahimsa (non-violence), Anekantavada (many-sidedness), and Aparigraha (non-possessiveness).
            </p>
            <div className="flex flex-col gap-3 font-sans">
              <Link href="/topic/tattvas" className="text-aged-brass hover:text-temple-ink transition-colors">→ The Seven Tattvas</Link>
              <Link href="/topic/karma" className="text-aged-brass hover:text-temple-ink transition-colors">→ Understanding Karma</Link>
              <Link href="/topic/jainCosmology" className="text-aged-brass hover:text-temple-ink transition-colors">→ Cosmology</Link>
              <Link href="/topic/gunasthanaks" className="text-aged-brass hover:text-temple-ink transition-colors">→ Gunasthanaks (Spiritual Development)</Link>
            </div>
          </section>

          <section className="bg-paper-surface p-10 border border-carved-line rounded-sm transition-colors hover:bg-marble-canvas">
            <h2 className="text-2xl mb-4 text-temple-ink">I want to read primary texts</h2>
            <p className="text-quiet-ink font-sans mb-8 leading-relaxed">
              Enter the library to examine canonical collections, commentaries, and manuscripts preserved across centuries.
            </p>
            <div className="flex flex-col gap-3 font-sans">
              <Link href="/topic/literature" className="text-aged-brass hover:text-temple-ink transition-colors">→ Explore the Library</Link>
              <Link href="/topic/bookshelf" className="text-aged-brass hover:text-temple-ink transition-colors">→ The Bookshelf</Link>
              <Link href="/topic/audioChants" className="text-aged-brass hover:text-temple-ink transition-colors">→ Audio Recitations</Link>
              <Link href="/topic/childrenStories" className="text-aged-brass hover:text-temple-ink transition-colors">→ Stories & Parables</Link>
            </div>
          </section>

          <section className="bg-paper-surface p-10 border border-carved-line rounded-sm transition-colors hover:bg-marble-canvas">
            <h2 className="text-2xl mb-4 text-temple-ink">I want to understand practice</h2>
            <p className="text-quiet-ink font-sans mb-8 leading-relaxed">
              Learn about everyday practice, reflection, vows, fasting, and temple life in their traditional forms.
            </p>
            <div className="flex flex-col gap-3 font-sans">
              <Link href="/topic/dailyPractices" className="text-aged-brass hover:text-temple-ink transition-colors">→ Everyday Practice</Link>
              <Link href="/topic/meditation" className="text-aged-brass hover:text-temple-ink transition-colors">→ Reflection and Meditation</Link>
              <Link href="/topic/fasting" className="text-aged-brass hover:text-temple-ink transition-colors">→ Fasting and Austerity</Link>
              <Link href="/topic/festivals" className="text-aged-brass hover:text-temple-ink transition-colors">→ Festivals</Link>
            </div>
          </section>

          <section className="bg-paper-surface p-10 border border-carved-line rounded-sm transition-colors hover:bg-marble-canvas">
            <h2 className="text-2xl mb-4 text-temple-ink">I want to explore people & places</h2>
            <p className="text-quiet-ink font-sans mb-8 leading-relaxed">
              Read about the Tirthankaras, historical teachers, lineages, and significant pilgrimage sites.
            </p>
            <div className="flex flex-col gap-3 font-sans">
              <Link href="/topic/tirthankaras" className="text-aged-brass hover:text-temple-ink transition-colors">→ The 24 Tirthankaras</Link>
              <Link href="/topic/acharyas" className="text-aged-brass hover:text-temple-ink transition-colors">→ Teachers and Scholars</Link>
              <Link href="/topic/pilgrimages" className="text-aged-brass hover:text-temple-ink transition-colors">→ Pilgrimage Places</Link>
              <Link href="/topic/community" className="text-aged-brass hover:text-temple-ink transition-colors">→ Traditions and Community</Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
