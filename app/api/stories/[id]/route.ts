import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoryById, updateStory, deleteStory } from '@/lib/db';
import { isAuthenticated } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await getStoryById(parseInt(id));

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updatedStory = await updateStory(parseInt(id), {
      titleFr: data.titleFr,
      titleEn: data.titleEn,
      contentFr: data.contentFr,
      contentEn: data.contentEn,
      excerptFr: data.excerptFr,
      excerptEn: data.excerptEn,
      coverImage: data.coverImage,
      tags: data.tags,
      published: data.published,
      publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
    });

    // Revalidate all pages that might show this story
    revalidatePath('/');
    revalidatePath(`/stories/${id}`);
    revalidatePath('/admin');
    revalidatePath('/admin/stories');

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteStory(parseInt(id));

    // Revalidate all pages after deletion
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/stories');

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
