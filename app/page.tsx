import Link from 'next/link';
import { getStories, Story } from '@/lib/db';
import SocialLinks from '@/components/SocialLinks';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations('home');

  let stories: Story[] = [];

  try {
    stories = await getStories(true); // Only published stories
  } catch {
    // Database not initialized yet
    console.log('Database not initialized yet');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-[family-name:var(--font-eb-garamond)]">
            Esolrine
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('description')}
          </p>
          <SocialLinks />
        </header>

        <main className="max-w-4xl mx-auto">
          {stories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">
                {t('noStories')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white border border-gray-200 rounded-lg hover:border-emerald-300 transition-all"
                >
                  <Link href={`/stories/${story.id}`} className="flex gap-6 p-6 md:p-8">
                    {story.cover_image && (
                      <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={story.cover_image}
                          alt={locale === 'fr' ? story.title_fr : story.title_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-emerald-700 transition-colors font-[family-name:var(--font-eb-garamond)]">
                          {locale === 'fr' ? story.title_fr : story.title_en}
                        </h2>
                        <time className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                          {new Date(story.publish_date).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2 font-[family-name:var(--font-eb-garamond)]">
                        {locale === 'fr' ? story.excerpt_fr : story.excerpt_en}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {story.tags && story.tags.length > 0 && story.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
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
