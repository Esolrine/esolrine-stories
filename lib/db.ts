import { sql } from '@vercel/postgres';

export interface Story {
  id: number;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  publish_date: Date;
  created_at: Date;
  updated_at: Date;
}

export async function createStoriesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      title_fr VARCHAR(255) NOT NULL DEFAULT '',
      title_en VARCHAR(255) NOT NULL DEFAULT '',
      content_fr TEXT NOT NULL DEFAULT '',
      content_en TEXT NOT NULL DEFAULT '',
      excerpt_fr TEXT NOT NULL DEFAULT '',
      excerpt_en TEXT NOT NULL DEFAULT '',
      cover_image TEXT,
      tags TEXT[] DEFAULT '{}',
      published BOOLEAN DEFAULT false,
      publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function getStories(publishedOnly: boolean = false) {
  let query;

  if (publishedOnly) {
    query = sql`SELECT * FROM stories WHERE published = true ORDER BY publish_date DESC`;
  } else {
    query = sql`SELECT * FROM stories ORDER BY updated_at DESC`;
  }

  const { rows } = await query;
  return rows as Story[];
}

export async function getStoryById(id: number) {
  const { rows } = await sql`SELECT * FROM stories WHERE id = ${id}`;
  return rows[0] as Story | undefined;
}

export async function createStory(data: {
  titleFr: string;
  titleEn: string;
  contentFr: string;
  contentEn: string;
  excerptFr: string;
  excerptEn: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  publishDate?: Date;
}) {
  const { rows } = await sql.query(
    `INSERT INTO stories (title_fr, title_en, content_fr, content_en, excerpt_fr, excerpt_en, cover_image, tags, published, publish_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      data.titleFr,
      data.titleEn,
      data.contentFr,
      data.contentEn,
      data.excerptFr,
      data.excerptEn,
      data.coverImage || null,
      data.tags || [],
      data.published || false,
      data.publishDate || new Date(),
    ]
  );
  return rows[0] as Story;
}

export async function updateStory(
  id: number,
  data: {
    titleFr?: string;
    titleEn?: string;
    contentFr?: string;
    contentEn?: string;
    excerptFr?: string;
    excerptEn?: string;
    coverImage?: string;
    tags?: string[];
    published?: boolean;
    publishDate?: Date;
  }
) {
  const updates: string[] = [];
  const values: (string | string[] | boolean | Date | number | null)[] = [];
  let paramCount = 1;

  if (data.titleFr !== undefined) {
    updates.push(`title_fr = $${paramCount++}`);
    values.push(data.titleFr);
  }
  if (data.titleEn !== undefined) {
    updates.push(`title_en = $${paramCount++}`);
    values.push(data.titleEn);
  }
  if (data.contentFr !== undefined) {
    updates.push(`content_fr = $${paramCount++}`);
    values.push(data.contentFr);
  }
  if (data.contentEn !== undefined) {
    updates.push(`content_en = $${paramCount++}`);
    values.push(data.contentEn);
  }
  if (data.excerptFr !== undefined) {
    updates.push(`excerpt_fr = $${paramCount++}`);
    values.push(data.excerptFr);
  }
  if (data.excerptEn !== undefined) {
    updates.push(`excerpt_en = $${paramCount++}`);
    values.push(data.excerptEn);
  }
  if (data.coverImage !== undefined) {
    updates.push(`cover_image = $${paramCount++}`);
    values.push(data.coverImage);
  }
  if (data.tags !== undefined) {
    updates.push(`tags = $${paramCount++}`);
    values.push(data.tags);
  }
  if (data.published !== undefined) {
    updates.push(`published = $${paramCount++}`);
    values.push(data.published);
  }
  if (data.publishDate !== undefined) {
    updates.push(`publish_date = $${paramCount++}`);
    values.push(data.publishDate);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const { rows } = await sql.query(
    `UPDATE stories SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return rows[0] as Story;
}

export async function deleteStory(id: number) {
  await sql`DELETE FROM stories WHERE id = ${id}`;
}

// Migration function to convert from old schema (language, translation_id) to new schema (bilingual fields)
export async function migrateStoriesToBilingual() {
  try {
    // Step 1: Add new bilingual columns
    await sql`
      ALTER TABLE stories
      ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255) DEFAULT '',
      ADD COLUMN IF NOT EXISTS title_en VARCHAR(255) DEFAULT '',
      ADD COLUMN IF NOT EXISTS content_fr TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS content_en TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS excerpt_fr TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS excerpt_en TEXT DEFAULT ''
    `;

    // Step 2: Migrate data from old schema to new schema
    // For French stories: copy to _fr fields
    await sql`
      UPDATE stories
      SET title_fr = title,
          content_fr = content,
          excerpt_fr = excerpt
      WHERE language = 'fr'
    `;

    // For English stories: copy to _en fields
    await sql`
      UPDATE stories
      SET title_en = title,
          content_en = content,
          excerpt_en = excerpt
      WHERE language = 'en'
    `;

    // Step 3: For stories with translations, merge them
    await sql`
      UPDATE stories s1
      SET title_en = s2.title,
          content_en = s2.content,
          excerpt_en = s2.excerpt
      FROM stories s2
      WHERE s1.translation_id = s2.id
        AND s1.language = 'fr'
        AND s2.language = 'en'
    `;

    await sql`
      UPDATE stories s1
      SET title_fr = s2.title,
          content_fr = s2.content,
          excerpt_fr = s2.excerpt
      FROM stories s2
      WHERE s1.translation_id = s2.id
        AND s1.language = 'en'
        AND s2.language = 'fr'
    `;

    // Step 4: Delete duplicate translations (keep only one record per story pair)
    await sql`
      DELETE FROM stories
      WHERE id IN (
        SELECT s2.id
        FROM stories s1
        JOIN stories s2 ON s1.translation_id = s2.id
        WHERE s1.language = 'fr' AND s2.language = 'en'
      )
    `;

    // Step 5: Drop old columns
    await sql`
      ALTER TABLE stories
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS content,
      DROP COLUMN IF EXISTS excerpt,
      DROP COLUMN IF EXISTS language,
      DROP COLUMN IF EXISTS translation_id
    `;

    // Step 6: Make new columns NOT NULL
    await sql`
      ALTER TABLE stories
      ALTER COLUMN title_fr SET NOT NULL,
      ALTER COLUMN title_en SET NOT NULL,
      ALTER COLUMN content_fr SET NOT NULL,
      ALTER COLUMN content_en SET NOT NULL,
      ALTER COLUMN excerpt_fr SET NOT NULL,
      ALTER COLUMN excerpt_en SET NOT NULL
    `;

    console.log('Migration to bilingual schema completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
