import { migrateStoriesTable } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await migrateStoriesTable();
    return NextResponse.json({ message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
