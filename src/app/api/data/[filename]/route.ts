import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDirectory = path.resolve(process.cwd(), 'src', 'data');

export const dynamic = 'force-static';

export function generateStaticParams() {
  return fs
    .readdirSync(dataDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => ({ filename: entry.name.slice(0, -'.json'.length) }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
    return NextResponse.json(
      { success: false, error: 'Invalid data file name' },
      { status: 400 }
    );
  }

  try {
    const filePath = path.resolve(dataDirectory, `${filename}.json`);
    if (path.dirname(filePath) !== dataDirectory) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json({
      success: true,
      data,
      editorialStatus: 'unreviewed',
    });
  } catch (error) {
    console.error(`Error loading data file ${filename}:`, error);
    return NextResponse.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    );
  }
}
