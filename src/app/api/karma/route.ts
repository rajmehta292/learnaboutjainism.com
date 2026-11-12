import { NextResponse } from 'next/server';
import karmaTheory from '@/data/karmaTheory.json';

export const dynamic = 'force-static';

type KarmaSubtype = { name: string; desc?: string };
type KarmaRecord = {
  name: string;
  sanskrit?: string;
  transliteration?: string;
  description: string;
  subtypes?: KarmaSubtype[];
  howToDestroy?: string;
};

function toCategory(record: KarmaRecord, type: 'Ghatiya' | 'Aghatiya') {
  const id = `${type.toLowerCase()}-${record.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

  return {
    id,
    name: record.name,
    transliteration: record.transliteration ?? record.name,
    type,
    descriptionL1: record.description,
    descriptionL3: record.description,
    descriptionL5: record.howToDestroy ?? record.description,
    subtypes: (record.subtypes ?? []).map((subtype, subtypeIndex) => ({
      id: `${id}-${subtypeIndex + 1}`,
      categoryId: id,
      name: subtype.name,
      transliteration: subtype.name,
      description: subtype.desc ?? '',
    })),
    citations: [],
    editorialStatus: 'unreviewed' as const,
  };
}

export async function GET() {
  const records = [
    ...(karmaTheory.ghatiyaKarmas as KarmaRecord[]).map((record) =>
      toCategory(record, 'Ghatiya'),
    ),
    ...(karmaTheory.aghatiyaKarmas as KarmaRecord[]).map((record) =>
      toCategory(record, 'Aghatiya'),
    ),
  ];

  return NextResponse.json({
    success: true,
    data: records,
    editorialStatus: 'unreviewed',
    note: 'This study dataset has not received item-by-item editorial and source review.',
  });
}
