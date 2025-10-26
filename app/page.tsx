import Link from 'next/link';
import { getStories, Story } from '@/lib/db';
import SocialLinks from '@/components/SocialLinks';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { getLocale, getTranslations } from 'next-intl/server';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations('home');

  let stories: Story[] = [];

  try {
    const allStories = await getStories(true); // Only published stories
    // Filter stories to only show those with content in the selected language
    stories = allStories.filter(story => {
      if (locale === 'fr') {
        return story.title_fr && story.title_fr.trim() !== '';
      } else {
        return story.title_en && story.title_en.trim() !== '';
      }
    });
  } catch {
    // Database not initialized yet
    console.log('Database not initialized yet');
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="flex justify-end mb-6">
          <LocaleSwitcher />
        </div>

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
            <div className="space-y-20">
              {stories.map((story, index) => (
                <article
                  key={story.id}
                  className={`${index !== 0 ? 'pt-20 border-t border-gray-200' : ''}`}
                >
                  <Link href={`/stories/${story.id}`} className="block group">
                    <div className="flex items-start justify-between mb-4">
                      <time className="text-sm text-gray-500 uppercase tracking-wider font-light">
                        {new Date(story.publish_date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 justify-end">
                          {story.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 uppercase tracking-wider font-light"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-eb-garamond)] leading-tight group-hover:text-emerald-700 transition-colors">
                      {locale === 'fr' ? story.title_fr : story.title_en}
                    </h2>

                    {story.cover_image && (
                      <div className="mb-8 overflow-hidden rounded-sm">
                        <img
                          src={story.cover_image}
                          alt={locale === 'fr' ? story.title_fr : story.title_en}
                          className="w-full h-48 md:h-64 object-cover group-hover:opacity-95 transition-opacity"
                        />
                      </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                      <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-[family-name:var(--font-eb-garamond)] mb-0">
                        {locale === 'fr' ? story.excerpt_fr : story.excerpt_en}
                      </p>
                    </div>

                    <div className="mt-6 text-emerald-700 font-medium text-sm uppercase tracking-wider group-hover:text-emerald-800 transition-colors">
                      {locale === 'fr' ? 'Lire la suite →' : 'Read more →'}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>

        <footer className="text-center mt-20 pt-12 border-t border-gray-200 text-gray-500 text-sm font-light">
          <p>
            {t('footer')}
          </p>
        </footer>
      </div>
    </div>
  );
}
