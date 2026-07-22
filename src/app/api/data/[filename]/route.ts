import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  try {
    const filePath = path.join(process.cwd(), 'src/data', `${filename}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(`Error loading data file ${filename}:`, error);
    return NextResponse.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    );
  }
}
