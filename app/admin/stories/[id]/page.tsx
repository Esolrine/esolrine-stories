import { getStoryById } from '@/lib/db';
import { notFound } from 'next/navigation';
import StoryForm from '@/components/admin/StoryForm';

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStoryById(parseInt(id));

  if (!story) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Story</h1>
      <StoryForm story={story} />
    </div>
  );
}
