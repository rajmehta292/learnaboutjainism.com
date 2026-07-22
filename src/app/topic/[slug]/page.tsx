"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SmartLinker from '@/components/SmartLinker';

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/data/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const titleFormat = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });

  return (
    <div className="min-h-screen">
      <nav className="max-w-4xl mx-auto px-6 pt-12 pb-4">
        <Link href="/" className="text-quiet-ink hover:text-temple-ink font-sans transition-colors duration-200 flex items-center gap-2">
          <span>←</span> Return to Library
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-32">
        <section className="bg-paper-surface p-12 rounded-sm border border-carved-line shadow-[0_2px_10px_rgba(46,44,40,0.02)]">
          <header className="mb-12 border-b border-carved-line pb-8 text-center">
            <h1 className="text-4xl mb-4 text-temple-ink">{titleFormat(slug)}</h1>
            <p className="text-quiet-ink font-sans max-w-2xl mx-auto leading-relaxed">
              Explore the carefully preserved records and knowledge base regarding {titleFormat(slug).toLowerCase()}.
            </p>
          </header>
          
          {loading ? (
            <div className="animate-pulse space-y-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-soft-stone rounded w-1/4"></div>
                  <div className="h-4 bg-soft-stone rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-quiet-ink font-sans">This record is still being reviewed. Some details or source files may not yet be available.</p>
              <Link href="/" className="inline-block mt-6 px-6 py-2 border border-carved-line text-temple-ink rounded-sm hover:bg-marble-canvas transition-colors font-sans text-sm">
                Return Home
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Dynamic JSON Rendering */}
              {Array.isArray(data) ? (
                data.map((item: any, idx: number) => (
                  <article 
                    key={item.id || idx} 
                    id={(item.term || item.name || item.title || item.category || 'record').toLowerCase().replace(/\s+/g, '-')}
                    className="relative border-b border-carved-line/30 pb-12 last:border-0 last:pb-0"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl text-temple-ink flex items-center gap-3">
                        {item.name || item.title || item.category || 'Record'}
                      </h2>
                      {item.transliteration && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-sans text-quiet-ink text-sm italic">{item.transliteration}</span>
                        </div>
                      )}
                    </div>
                    
                    
                    <div className="space-y-6 font-sans text-temple-ink leading-relaxed">
                      {(item.description || item.desc) && <p><SmartLinker text={item.description || item.desc} /></p>}
                      
                      {/* Tirthankara Metadata */}
                      {(item.birth || item.nirvana || item.parents) && (
                        <div className="grid grid-cols-2 gap-4 text-sm bg-soft-stone/20 p-4 rounded-sm">
                          {item.birth && <div><strong className="text-quiet-ink">Birthplace:</strong> <SmartLinker text={item.birth} /></div>}
                          {item.nirvana && <div><strong className="text-quiet-ink">Nirvana Place:</strong> <SmartLinker text={item.nirvana} /></div>}
                          {item.parents && <div><strong className="text-quiet-ink">Parents:</strong> {item.parents}</div>}
                          {item.tree && <div><strong className="text-quiet-ink">Kevala Tree:</strong> {item.tree}</div>}
                          {item.yaksha && <div><strong className="text-quiet-ink">Yaksha:</strong> {item.yaksha}</div>}
                          {item.yakshini && <div><strong className="text-quiet-ink">Yakshini:</strong> {item.yakshini}</div>}
                          {item.color && <div><strong className="text-quiet-ink">Complexion:</strong> {item.color}</div>}
                          {item.symbol && <div><strong className="text-quiet-ink">Emblem:</strong> {item.symbol}</div>}
                        </div>
                      )}

                      {item.meaning && (
                        <div className="mt-4">
                          <strong className="block text-sm uppercase tracking-wide text-quiet-ink mb-1">Meaning & Purpose</strong>
                          <p><SmartLinker text={item.meaning} /></p>
                        </div>
                      )}
                      
                      {item.details && (
                        <div className="mt-4 bg-marble-canvas p-6 rounded-sm border border-soft-stone">
                          <p><SmartLinker text={item.details} /></p>
                        </div>
                      )}
                      
                      {item.list && Array.isArray(item.list) && (
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-quiet-ink">
                          {item.list.map((listItem: any, i: number) => (
                            <li key={i}>
                              <SmartLinker text={typeof listItem === 'string' ? listItem : listItem.name} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <pre className="font-mono text-sm text-quiet-ink whitespace-pre-wrap bg-soft-stone/20 p-6 rounded-sm">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
