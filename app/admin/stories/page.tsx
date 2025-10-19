import Link from 'next/link';
import { getStories } from '@/lib/db';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function StoriesPage() {
  let stories = [];

  try {
    stories = await getStories(false);
  } catch (error) {
    // Database not initialized yet
    console.log('Database not initialized yet');
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
        <Link
          href="/admin/stories/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No stories yet</p>
          <Link
            href="/admin/stories/new"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Create your first story
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publish Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link
                        href={`/admin/stories/${story.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-emerald-600"
                      >
                        {story.title}
                      </Link>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {story.excerpt}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        story.published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {story.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(story.publish_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(story.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/stories/${story.id}`}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Edit
                      </Link>
                      {story.published && (
                        <Link
                          href={`/stories/${story.id}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View
                        </Link>
                      )}
                      <DeleteButton storyId={story.id} storyTitle={story.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
