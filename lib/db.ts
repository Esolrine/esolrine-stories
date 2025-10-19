import { sql } from '@vercel/postgres';

export interface Story {
  id: number;
  title: string;
  content: string;
  excerpt: string;
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
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
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
  const query = publishedOnly
    ? sql`SELECT * FROM stories WHERE published = true ORDER BY publish_date DESC`
    : sql`SELECT * FROM stories ORDER BY updated_at DESC`;

  const { rows } = await query;
  return rows as Story[];
}

export async function getStoryById(id: number) {
  const { rows } = await sql`SELECT * FROM stories WHERE id = ${id}`;
  return rows[0] as Story | undefined;
}

export async function getStoryBySlug(slug: string) {
  // For now, we'll use title-based slugs
  // You can add a slug column later if needed
  const title = slug.replace(/-/g, ' ');
  const { rows } = await sql`
    SELECT * FROM stories
    WHERE LOWER(title) = LOWER(${title})
    AND published = true
  `;
  return rows[0] as Story | undefined;
}

export async function createStory(data: {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  publishDate?: Date;
}) {
  const { rows } = await sql`
    INSERT INTO stories (title, content, excerpt, cover_image, tags, published, publish_date)
    VALUES (
      ${data.title},
      ${data.content},
      ${data.excerpt},
      ${data.coverImage || null},
      ${data.tags || []},
      ${data.published || false},
      ${data.publishDate || new Date()}
    )
    RETURNING *
  `;
  return rows[0] as Story;
}

export async function updateStory(
  id: number,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    published?: boolean;
    publishDate?: Date;
  }
) {
  const updates: string[] = [];
  const values: (string | string[] | boolean | Date | number)[] = [];
  let paramCount = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramCount++}`);
    values.push(data.title);
  }
  if (data.content !== undefined) {
    updates.push(`content = $${paramCount++}`);
    values.push(data.content);
  }
  if (data.excerpt !== undefined) {
    updates.push(`excerpt = $${paramCount++}`);
    values.push(data.excerpt);
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
