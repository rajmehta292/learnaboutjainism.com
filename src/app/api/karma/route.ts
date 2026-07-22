import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const karmaCategories = await prisma.karmaCategory.findMany({
      include: {
        subtypes: true,
        citations: true,
      },
      orderBy: {
        id: 'asc' // Simple sort, can be enhanced
      }
    });

    return NextResponse.json({
      success: true,
      data: karmaCategories
    });
  } catch (error: any) {
    console.error('Error fetching karma categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch karma data' },
      { status: 500 }
    );
  }
}
