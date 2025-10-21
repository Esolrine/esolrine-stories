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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <header className="text-center mb-16 pb-12 border-b border-gray-200">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-eb-garamond)] tracking-tight">
            Esolrine
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-light">
            {t('description')}
          </p>
          <SocialLinks />
        </header>

        <main>
          {stories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg font-light">
                {t('noStories')}
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {stories.map((story, index) => (
                <article
                  key={story.id}
                  className={`${index !== 0 ? 'pt-16 border-t border-gray-200' : ''}`}
                >
                  <Link href={`/stories/${story.id}`} className="block group">
                    <div className="flex items-start justify-between mb-3">
                      <time className="text-sm text-gray-500 uppercase tracking-wide font-light">
                        {new Date(story.publish_date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {story.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 uppercase tracking-wide font-light"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-eb-garamond)] leading-tight group-hover:text-emerald-700 transition-colors">
                      {locale === 'fr' ? story.title_fr : story.title_en}
                    </h2>

                    {story.cover_image && (
                      <div className="mb-6 overflow-hidden">
                        <img
                          src={story.cover_image}
                          alt={locale === 'fr' ? story.title_fr : story.title_en}
                          className="w-full h-64 md:h-96 object-cover group-hover:opacity-95 transition-opacity"
                        />
                      </div>
                    )}

                    <p className="text-lg text-gray-700 leading-relaxed font-[family-name:var(--font-eb-garamond)] line-clamp-3">
                      {locale === 'fr' ? story.excerpt_fr : story.excerpt_en}
                    </p>

                    <div className="mt-4 text-emerald-700 font-medium text-sm uppercase tracking-wide group-hover:text-emerald-800">
                      Lire la suite →
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>

        <footer className="text-center mt-20 pt-12 border-t border-gray-200 text-gray-500 text-sm font-light">
          <p>
            Part of the Esolrine webtoon universe
          </p>
        </footer>
      </div>
    </div>
  );
}
