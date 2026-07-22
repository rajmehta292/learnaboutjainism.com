import React from 'react';
import fs from 'fs';
import path from 'path';

export default async function OntologyExplorer() {
  // Read the ontology from the JSON file
  const filePath = path.join(process.cwd(), 'src', 'data', 'ontology.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const ontology = JSON.parse(fileContents);

  return (
    <main className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-12 border-b border-carved-line pb-8">
        <h1 className="text-4xl font-serif text-temple-ink mb-4">Jainism Knowledge Ontology</h1>
        <p className="text-lg font-sans text-quiet-ink max-w-3xl leading-relaxed">
          Explore {ontology.topic_count} topics across {ontology.domain_count} structured knowledge domains.
          This ontology provides a definitive, source-grounded map of Jain philosophy, history, and practice.
        </p>
      </header>

      <div className="space-y-8">
        {ontology.domains.map((domain: any) => (
          <details 
            key={domain.domain_id} 
            className="group bg-paper-surface border border-carved-line rounded-sm overflow-hidden"
          >
            <summary className="cursor-pointer bg-marble-canvas p-6 flex items-center justify-between hover:bg-soft-stone/30 transition-colors">
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-aged-brass font-semibold tracking-wider">
                    {domain.domain_id}
                  </span>
                  <h2 className="text-xl font-serif text-temple-ink">
                    {domain.domain}
                  </h2>
                </div>
                {domain.purpose && (
                  <p className="mt-2 text-sm font-sans text-quiet-ink italic">
                    {domain.purpose}
                  </p>
                )}
              </div>
              
              {/* Expand Icon */}
              <div className="text-carved-line group-open:rotate-180 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            
            <div className="p-6 bg-[#FAF9F6] border-t border-carved-line/30 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {domain.topics.map((topic: any) => (
                <div key={topic.topic_id} className="flex items-start gap-3">
                  <span className="text-xs font-mono text-quiet-ink/60 mt-1 whitespace-nowrap">
                    {topic.topic_id}
                  </span>
                  <span className="text-sm font-sans text-temple-ink font-medium hover:text-[#C17817] cursor-pointer transition-colors">
                    {topic.title}
                  </span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
