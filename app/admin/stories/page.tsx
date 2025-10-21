import Link from 'next/link';
import { getStories, Story } from '@/lib/db';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function StoriesPage() {
  let stories: Story[] = [];

  try {
    stories = await getStories(false);
  } catch {
    // Database not initialized yet
    console.log('Database not initialized yet');
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gérer les histoires</h1>
        <Link
          href="/admin/stories/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Nouvelle histoire
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="py-16 text-center border-t border-gray-200">
          <p className="text-gray-700 mb-4">Aucune histoire pour le moment</p>
          <Link
            href="/admin/stories/new"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Créer votre première histoire
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className={`py-6 ${index !== 0 ? 'border-t border-gray-200' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/admin/stories/${story.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                    >
                      {story.title_fr}
                    </Link>
                    <span
                      className={`px-2 py-1 text-xs font-medium uppercase tracking-wide ${
                        story.published
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {story.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {story.excerpt_fr}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 uppercase tracking-wide">
                    <span>Publié : {new Date(story.publish_date).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>Modifié : {new Date(story.updated_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <Link
                    href={`/admin/stories/${story.id}`}
                    className="text-emerald-600 hover:text-emerald-900 transition-colors"
                  >
                    Modifier
                  </Link>
                  {story.published && (
                    <Link
                      href={`/stories/${story.id}`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Voir
                    </Link>
                  )}
                  <DeleteButton storyId={story.id} storyTitle={story.title_fr} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
