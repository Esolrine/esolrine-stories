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
    <article className="max-w-3xl mx-auto">
      {/* Language Selector */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex gap-1" role="group">
          <button
            type="button"
            onClick={() => setLanguage('fr')}
            className={`px-6 py-2 text-sm font-medium transition-all border-b-2 ${
              language === 'fr'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Français
          </button>
          <span className="text-gray-300 self-center">|</span>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 text-sm font-medium transition-all border-b-2 ${
              language === 'en'
                ? 'border-emerald-700 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 font-[family-name:var(--font-eb-garamond)] leading-tight tracking-tight">
          {title}
        </h1>
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-gray-200">
          <time className="text-sm text-gray-500 uppercase tracking-wide font-light">
            {new Date(story.publish_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-3">
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
      </header>

      <div
        className="prose prose-lg prose-emerald max-w-none font-[family-name:var(--font-eb-garamond)] text-[#1a1a1a] prose-headings:text-black prose-p:text-[#1a1a1a] prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:shadow-none prose-li:text-[#1a1a1a] prose-blockquote:text-[#2c2c2c] prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-strong:text-black"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
