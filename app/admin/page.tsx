import Link from 'next/link';
import { getStories, Story } from '@/lib/db';

export default async function AdminDashboard() {
  let stories: Story[] = [];

  try {
    stories = await getStories(false);
  } catch {
    // Database not initialized yet
    console.log('Database not initialized yet');
  }

  const publishedCount = stories.filter((s) => s.published).length;
  const draftCount = stories.filter((s) => !s.published).length;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-gray-200">
        <div className="py-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Total des histoires
          </h3>
          <p className="text-4xl font-bold text-gray-900">{stories.length}</p>
        </div>
        <div className="py-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Publiées</h3>
          <p className="text-4xl font-bold text-emerald-600">
            {publishedCount}
          </p>
        </div>
        <div className="py-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Brouillons</h3>
          <p className="text-4xl font-bold text-amber-600">{draftCount}</p>
        </div>
      </div>

      <div className="mb-12 pb-12 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/stories/new"
            className="flex items-center gap-3 p-6 border border-gray-300 hover:border-emerald-600 transition-colors"
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
            <span className="font-medium text-gray-700">Créer une nouvelle histoire</span>
          </Link>
          <Link
            href="/admin/stories"
            className="flex items-center gap-3 p-6 border border-gray-300 hover:border-emerald-600 transition-colors"
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
            <span className="font-medium text-gray-700">Gérer les histoires</span>
          </Link>
        </div>
      </div>

      {stories.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Histoires récentes
          </h2>
          <div className="space-y-4">
            {stories.slice(0, 5).map((story) => (
              <Link
                key={story.id}
                href={`/admin/stories/${story.id}`}
                className="block py-4 border-b border-gray-200 hover:border-emerald-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">{story.title_fr}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(story.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                      story.published
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {story.published ? 'Publié' : 'Brouillon'}
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
