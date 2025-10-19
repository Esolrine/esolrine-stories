import { NextResponse } from 'next/server';
import { createStoriesTable } from '@/lib/db';

export async function GET() {
  try {
    await createStoriesTable();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
