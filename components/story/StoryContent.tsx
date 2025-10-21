'use client';

import { useState, useEffect } from 'react';
import { Story } from '@/lib/db';

interface StoryContentProps {
  story: Story;
}

export default function StoryContent({ story }: StoryContentProps) {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  // Set initial language based on browser/system preference
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr' || browserLang === 'en') {
      setLanguage(browserLang);
    }
  }, []);

  const title = language === 'fr' ? story.title_fr : story.title_en;
  const content = language === 'fr' ? story.content_fr : story.content_en;

  return (
    <article className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg">
      <div className="p-6 md:p-12">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors ${
                language === 'fr'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 text-sm font-medium border-t border-r border-b rounded-r-lg transition-colors ${
                language === 'en'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-eb-garamond)] leading-tight">
            {title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {story.tags && story.tags.length > 0 && story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <time className="text-sm text-gray-500">
              {new Date(story.publish_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div
          className="prose prose-lg prose-emerald max-w-none font-[family-name:var(--font-eb-garamond)] text-[#1a1a1a] prose-headings:text-black prose-p:text-[#1a1a1a] prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md prose-li:text-[#1a1a1a] prose-blockquote:text-[#2c2c2c] prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
