"use client"
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

// Global cache so we don't fetch glossary multiple times per page
let cachedGlossary: string[] = [];

export default function SmartLinker({ text }: { text: string }) {
  const [terms, setTerms] = useState<string[]>(cachedGlossary);

  useEffect(() => {
    if (cachedGlossary.length === 0) {
      fetch('/api/data/glossary')
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            const extractedTerms = json.data.map((t: any) => t.term);
            cachedGlossary = extractedTerms;
            setTerms(extractedTerms);
          }
        })
        .catch(err => console.error("Failed to load glossary for cross-linking", err));
    }
  }, []);

  const parsedText = useMemo(() => {
    if (!text || terms.length === 0) return <>{text}</>;

    // Sort terms by length descending so longer terms match first (e.g. "Kevala Jnana" before "Jnana")
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
    
    // Create a regex to match any of the terms exactly (case-insensitive, word boundaries)
    const escapedTerms = sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, i) => {
      // If it's a match, it will be at an odd index in the split array if we used capturing groups
      // Or we can just check if part lowercased is in our terms
      const matchedTerm = sortedTerms.find(t => t.toLowerCase() === part.toLowerCase());
      
      if (matchedTerm) {
        return (
          <Link 
            key={i} 
            href={`/topic/glossary#${matchedTerm.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-aged-brass border-b border-aged-brass/30 hover:border-aged-brass transition-colors"
            title={`View definition for ${matchedTerm}`}
          >
            {part}
          </Link>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

  }, [text, terms]);

  return <>{parsedText}</>;
}
