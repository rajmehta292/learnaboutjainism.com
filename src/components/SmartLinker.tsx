import React from 'react';
import fs from 'fs';
import path from 'path';
import { Link } from '@/i18n/routing';

// Cache the ontology map in memory on the server so we only build it once
let ontologyMap: { title: string; id: string }[] | null = null;

function getOntologyMap() {
  if (ontologyMap) return ontologyMap;

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'ontology.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ontology = JSON.parse(fileContents);

    const map: { title: string; id: string }[] = [];

    for (const domain of ontology.domains) {
      for (const topic of domain.topics) {
        // Only index terms that are reasonably specific (avoid linking single common words)
        if (topic.title && topic.title.length > 3) {
          map.push({ title: topic.title, id: topic.topic_id });
        }
      }
    }

    // Sort by length descending — longer terms match before shorter ones
    map.sort((a, b) => b.title.length - a.title.length);
    ontologyMap = map;
    return map;
  } catch (error) {
    console.error("SmartLinker failed to load ontology:", error);
    return [];
  }
}

function getTopicOverview(topicId: string): string {
  try {
    const topicPath = path.join(process.cwd(), 'src', 'data', 'topics', `${topicId}.json`);
    if (fs.existsSync(topicPath)) {
      const topicData = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
      if (topicData.overview) {
        const clean = topicData.overview.replace(/\n/g, ' ').trim();
        return clean.length > 220 ? clean.slice(0, 220) + '…' : clean;
      }
    }
  } catch {
    // silent
  }
  return '';
}

interface SmartLinkerProps {
  text: string;
  currentTopicId?: string; // Don't link back to the current page
}

export default function SmartLinker({ text, currentTopicId }: SmartLinkerProps) {
  if (!text) return <>{text}</>;

  const map = getOntologyMap();
  if (map.length === 0) return <>{text}</>;

  // Filter out the current topic to avoid self-links
  const filteredMap = currentTopicId
    ? map.filter(t => t.id !== currentTopicId)
    : map;

  if (filteredMap.length === 0) return <>{text}</>;

  // Build regex from filtered map
  const escapedTerms = filteredMap.map(t =>
    t.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  const parts = text.split(regex);

  // Track which terms we've already linked in this block to avoid repetitive linking
  const linkedTerms = new Set<string>();

  const parsedText = parts.map((part, i) => {
    if (i % 2 !== 0) {
      const matchedTerm = filteredMap.find(
        t => t.title.toLowerCase() === part.toLowerCase()
      );

      if (matchedTerm) {
        const termKey = matchedTerm.id;

        // Only link the first occurrence of each term per SmartLinker call
        if (linkedTerms.has(termKey)) {
          return <React.Fragment key={i}>{part}</React.Fragment>;
        }
        linkedTerms.add(termKey);

        const overview = getTopicOverview(matchedTerm.id);

        return (
          <span key={i} className="smart-link-container">
            <Link href={`/ontology/${matchedTerm.id}`} className="smart-link">
              {part}
            </Link>

            {overview && (
              <span
                className="smart-link-tooltip"
                role="tooltip"
              >
                <span className="smart-link-tooltip__label">Draft overview</span>
                <strong>{matchedTerm.title}</strong>
                <span>{overview}</span>
              </span>
            )}
          </span>
        );
      }
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });

  return <>{parsedText}</>;
}
