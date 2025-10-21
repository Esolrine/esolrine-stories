import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStories, createStory } from '@/lib/db';
import { isAuthenticated } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    const stories = await getStories(publishedOnly);
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.titleFr || !data.titleEn || !data.contentFr || !data.contentEn || !data.excerptFr || !data.excerptEn) {
      return NextResponse.json(
        { error: 'French and English titles, contents, and excerpts are required' },
        { status: 400 }
      );
    }

    const story = await createStory({
      titleFr: data.titleFr,
      titleEn: data.titleEn,
      contentFr: data.contentFr,
      contentEn: data.contentEn,
      excerptFr: data.excerptFr,
      excerptEn: data.excerptEn,
      coverImage: data.coverImage,
      tags: data.tags || [],
      published: data.published || false,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
    });

    // Revalidate homepage to show new story
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/stories');

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
