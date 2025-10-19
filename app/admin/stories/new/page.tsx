import StoryForm from '@/components/admin/StoryForm';

export default function NewStoryPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Story</h1>
      <StoryForm />
    </div>
  );
}
