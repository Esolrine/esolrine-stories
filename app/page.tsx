import Link from 'next/link';
import { getStories } from '@/lib/db';
import SocialLinks from '@/components/SocialLinks';

export default async function Home() {
  let stories = [];

  try {
    stories = await getStories(true); // Only published stories
  } catch (error) {
    // Database not initialized yet
    console.log('Database not initialized yet');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Esolrine
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            Stories from a world of magic and possibility
          </p>
          <SocialLinks />
        </header>

        <main className="max-w-4xl mx-auto">
          {stories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">
                No stories published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/stories/${story.id}`} className="block">
                    {story.cover_image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={story.cover_image}
                          alt={story.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors">
                        {story.title}
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {story.excerpt}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex flex-wrap gap-2">
                          {story.tags && story.tags.length > 0 && story.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <time className="text-sm text-gray-500">
                          {new Date(story.publish_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>
            Part of the Esolrine webtoon universe
          </p>
        </footer>
      </div>
    </div>
  );
}
