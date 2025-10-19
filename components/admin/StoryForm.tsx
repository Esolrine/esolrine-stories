'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Story } from '@/lib/db';
import { useTranslations } from 'next-intl';

interface StoryFormProps {
  story?: Story;
}

export default function StoryForm({ story }: StoryFormProps) {
  const router = useRouter();
  const t = useTranslations('admin.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStories, setAvailableStories] = useState<Story[]>([]);
  const [formData, setFormData] = useState({
    title: story?.title || '',
    excerpt: story?.excerpt || '',
    content: story?.content || '',
    coverImage: story?.cover_image || '',
    tags: story?.tags?.join(', ') || '',
    published: story?.published || false,
    publishDate: story?.publish_date
      ? new Date(story.publish_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    language: story?.language || 'en' as 'en' | 'fr',
    translationId: story?.translation_id?.toString() || '',
  });

  // Fetch available stories for translation linking
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        if (response.ok) {
          const data = await response.json();
          // Filter out current story and stories in same language
          const filtered = data.filter((s: Story) =>
            s.id !== story?.id && s.language !== formData.language
          );
          setAvailableStories(filtered);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
    fetchStories();
  }, [story?.id, formData.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = story ? `/api/stories/${story.id}` : '/api/stories';
      const method = story ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImage: formData.coverImage || undefined,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          published: formData.published,
          publishDate: formData.publishDate,
          language: formData.language,
          translationId: formData.translationId ? parseInt(formData.translationId) : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to save story');

      router.push('/admin/stories');
      router.refresh();
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story');
      setIsSubmitting(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert('Failed to upload cover image');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            {t('language')}
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as 'en' | 'fr' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
          >
            <option value="en">{t('english')}</option>
            <option value="fr">{t('french')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            {t('title')}
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            placeholder={t('titlePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            {t('excerpt')}
          </label>
          <textarea
            id="excerpt"
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-500"
            placeholder={t('excerptPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="translationId" className="block text-sm font-medium text-gray-700 mb-2">
            Link to translation (optional)
          </label>
          <select
            id="translationId"
            value={formData.translationId}
            onChange={(e) => setFormData({ ...formData, translationId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
          >
            <option value="">No translation</option>
            {availableStories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.language})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('coverImage')}
          </label>
          {formData.coverImage && (
            <div className="mb-3">
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="w-full max-w-md h-48 object-cover rounded-md"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            {t('tags')}
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-500"
            placeholder={t('tagsPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('content')}</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="flex gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
              {t('published')}
            </label>
          </div>

          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t('publishDate')}
            </label>
            <input
              type="date"
              id="publishDate"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? t('saving') : t('save')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}
