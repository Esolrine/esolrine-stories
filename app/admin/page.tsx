import Link from 'next/link';
import { getStories } from '@/lib/db';

export default async function AdminDashboard() {
  const stories = await getStories(false);
  const publishedCount = stories.filter((s) => s.published).length;
  const draftCount = stories.filter((s) => !s.published).length;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Stories
          </h3>
          <p className="text-3xl font-bold text-gray-900">{stories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Published</h3>
          <p className="text-3xl font-bold text-emerald-600">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-amber-600">{draftCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/stories/new"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-medium text-gray-700">Create New Story</span>
          </Link>
          <Link
            href="/admin/stories"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium text-gray-700">Manage Stories</span>
          </Link>
        </div>
      </div>

      {stories.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Stories
          </h2>
          <div className="space-y-3">
            {stories.slice(0, 5).map((story) => (
              <Link
                key={story.id}
                href={`/admin/stories/${story.id}`}
                className="block p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{story.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(story.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      story.published
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {story.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
