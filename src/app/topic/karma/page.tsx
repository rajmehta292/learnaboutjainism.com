"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SmartLinker from '@/components/SmartLinker';

// Icons SVG components
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);

export default function KarmaTheory() {
  const [karmaData, setKarmaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/karma')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setKarmaData(data.data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs / Back */}
      <nav className="max-w-4xl mx-auto px-6 pt-12 pb-4">
        <Link href="/" className="text-quiet-ink hover:text-temple-ink font-sans transition-colors duration-200 flex items-center gap-2">
          <span>←</span> Return to Library
        </Link>
      </nav>

      {/* The Mandapa (Gathering space) */}
      <main className="max-w-4xl mx-auto px-6 pb-32">
        <section className="bg-paper-surface p-12 rounded-sm border border-carved-line shadow-[0_2px_10px_rgba(46,44,40,0.02)]">
          <header className="mb-12 border-b border-carved-line pb-8 text-center">
            <h1 className="text-4xl mb-4 text-temple-ink">Understanding Karma</h1>
            <p className="text-quiet-ink font-sans max-w-2xl mx-auto leading-relaxed">
              Jain texts describe karma as a subtle form of matter that becomes associated with the soul through activity, attachment, aversion, and passion. Karma theory explains how this bondage occurs, how it affects experience, and how it may gradually be brought to an end.
            </p>
          </header>
          
          {loading ? (
            <div className="animate-pulse space-y-12">
              {[1, 2].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-soft-stone rounded w-1/4"></div>
                  <div className="h-4 bg-soft-stone rounded w-3/4"></div>
                  <div className="h-4 bg-soft-stone rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {karmaData.map((category) => (
                <article key={category.id} className="relative">
                  <div className="mb-6">
                    <h2 className="text-2xl text-temple-ink flex items-center gap-3">
                      {category.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-sans text-quiet-ink text-sm italic">
                        {category.transliteration}
                      </span>
                      <span className="text-carved-line text-sm">•</span>
                      <span className="font-sans text-quiet-ink text-sm">
                        {category.type} Karma
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-8 font-sans">
                    {/* The Central Idea */}
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide text-quiet-ink uppercase mb-2">The Central Idea</h3>
                      <p className="text-temple-ink text-lg leading-relaxed">
                        <SmartLinker text={category.descriptionL1} />
                      </p>
                    </div>
                    
                    {/* Why it Matters (Intermediate) */}
                    <div className="pl-6 border-l border-carved-line">
                      <h3 className="text-sm font-semibold tracking-wide text-quiet-ink uppercase mb-2">Why it Matters</h3>
                      <p className="text-quiet-ink leading-relaxed">
                        <SmartLinker text={category.descriptionL3} />
                      </p>
                    </div>

                    {/* IN EVERYDAY LIFE - Bridging the Gap */}
                    <div className="bg-marble-canvas p-6 rounded-sm border border-soft-stone">
                      <h3 className="text-sm font-semibold tracking-wide text-temple-ink uppercase mb-3 flex items-center gap-2">
                        <span className="text-compassion-leaf">❖</span> In Everyday Life
                      </h3>
                      <p className="text-temple-ink leading-relaxed">
                        The teaching of {category.name} is not meant to create guilt or emotional distance, but to cultivate <strong>gentle awareness</strong> in our daily interactions. In everyday life, this practice looks like pausing before reacting in anger, choosing compassion when we feel misunderstood, and recognizing that our thoughts and words quietly shape our future state of mind. It is about taking gentle responsibility for our inner landscape without judging ourselves harshly when we stumble.
                      </p>
                    </div>
                    
                    {/* Scholarly Level */}
                    <div className="bg-soft-stone/30 p-6 rounded-sm text-quiet-ink text-sm leading-relaxed">
                      <h3 className="text-xs font-semibold tracking-wide text-quiet-ink uppercase mb-2">Study & Sources</h3>
                      <p className="mb-4"><SmartLinker text={category.descriptionL5} /></p>
                      
                      {category.citations.length > 0 && (
                        <div className="pt-4 border-t border-carved-line/50 flex flex-col gap-2">
                          {category.citations.map((c: any) => (
                            <div key={c.id} className="flex items-start gap-2">
                              <span className="text-aged-brass mt-0.5"><BookIcon /></span>
                              <div>
                                <span className="font-medium text-temple-ink">Source passage: </span>
                                <span>{c.citationText}</span>
                                <span className="ml-3 text-xs tracking-wider text-compassion-leaf uppercase">
                                  {c.confidenceLevel}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {category.subtypes.length > 0 && (
                    <div className="mt-8 font-sans">
                      <h3 className="text-sm font-semibold tracking-wide text-quiet-ink uppercase mb-4">
                        Prakritis (Sub-types)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.subtypes.map((sub: any) => (
                          <div key={sub.id} className="p-4 border border-carved-line/50 rounded-sm bg-paper-surface">
                            <strong className="block text-temple-ink mb-1">{sub.name}</strong>
                            <span className="text-quiet-ink text-sm leading-relaxed">{sub.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
