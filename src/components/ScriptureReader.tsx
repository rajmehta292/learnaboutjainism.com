"use client"
import React, { useState } from 'react';

type ScriptureSegment = {
  id: string;
  original: string; // Prakrit, Sanskrit, etc.
  transliteration?: string;
  translationEn?: string;
  translationLocal?: string; // Hindi, Gujarati, etc.
};

interface ScriptureReaderProps {
  title: string;
  author: string;
  segments: ScriptureSegment[];
  currentLocale: string;
}

export default function ScriptureReader({ title, author, segments, currentLocale }: ScriptureReaderProps) {
  const [showOriginal, setShowOriginal] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);

  return (
    <div className="bg-paper-surface border border-carved-line rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      <header className="bg-marble-canvas border-b border-carved-line px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-temple-ink">{title}</h2>
          <p className="text-sm font-sans text-quiet-ink italic">By {author}</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm font-sans text-quiet-ink cursor-pointer">
            <input 
              type="checkbox" 
              checked={showOriginal} 
              onChange={(e) => setShowOriginal(e.target.checked)} 
              className="rounded border-carved-line text-aged-brass focus:ring-aged-brass"
            />
            Original Script
          </label>
          <label className="flex items-center gap-2 text-sm font-sans text-quiet-ink cursor-pointer">
            <input 
              type="checkbox" 
              checked={showTransliteration} 
              onChange={(e) => setShowTransliteration(e.target.checked)}
              className="rounded border-carved-line text-aged-brass focus:ring-aged-brass"
            />
            Transliteration
          </label>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
        {segments.map((segment) => (
          <div key={segment.id} className="border-b border-carved-line/30 pb-6 last:border-0 last:pb-0">
            
            {showOriginal && (
              <p className="text-2xl font-serif text-temple-ink mb-3 leading-relaxed" dir="auto">
                {segment.original}
              </p>
            )}
            
            {showTransliteration && segment.transliteration && (
              <p className="text-md font-sans text-quiet-ink italic mb-4">
                {segment.transliteration}
              </p>
            )}

            <div className="bg-soft-stone/20 p-4 rounded-sm">
              <p className="text-md font-sans text-temple-ink leading-relaxed">
                {/* Fallback to English if local translation is missing */}
                {currentLocale !== 'en' && segment.translationLocal 
                  ? segment.translationLocal 
                  : segment.translationEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
