import { migrateStoriesToBilingual } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await migrateStoriesToBilingual();
    return NextResponse.json({ message: 'Migration to bilingual schema completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
