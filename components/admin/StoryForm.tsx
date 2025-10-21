'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Story } from '@/lib/db';

interface StoryFormProps {
  story?: Story;
}

export default function StoryForm({ story }: StoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLang, setCurrentLang] = useState<'fr' | 'en'>('fr');
  const [formData, setFormData] = useState({
    titleFr: story?.title_fr || '',
    titleEn: story?.title_en || '',
    excerptFr: story?.excerpt_fr || '',
    excerptEn: story?.excerpt_en || '',
    contentFr: story?.content_fr || '',
    contentEn: story?.content_en || '',
    coverImage: story?.cover_image || '',
    tags: story?.tags?.join(', ') || '',
    published: story?.published || false,
    publishDate: story?.publish_date
      ? new Date(story.publish_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

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
          titleFr: formData.titleFr,
          titleEn: formData.titleEn,
          contentFr: formData.contentFr,
          contentEn: formData.contentEn,
          excerptFr: formData.excerptFr,
          excerptEn: formData.excerptEn,
          coverImage: formData.coverImage || undefined,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          published: formData.published,
          publishDate: formData.publishDate,
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

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {/* Language tabs */}
        <div className="border-b border-gray-200 pb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setCurrentLang('fr')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentLang === 'fr'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentLang === 'en'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🇬🇧 English
            </button>
          </nav>
        </div>

        {/* French fields */}
        {currentLang === 'fr' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="titleFr" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (français)
              </label>
              <input
                type="text"
                id="titleFr"
                required
                value={formData.titleFr}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                placeholder="Entrez le titre en français"
              />
            </div>

            <div>
              <label htmlFor="excerptFr" className="block text-sm font-medium text-gray-700 mb-2">
                Extrait (français)
              </label>
              <textarea
                id="excerptFr"
                required
                rows={3}
                value={formData.excerptFr}
                onChange={(e) => setFormData({ ...formData, excerptFr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-500"
                placeholder="Résumé court de l'histoire en français"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu (français)
              </label>
              <RichTextEditor
                content={formData.contentFr}
                onChange={(content) => setFormData({ ...formData, contentFr: content })}
              />
            </div>
          </div>
        )}

        {/* English fields */}
        {currentLang === 'en' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (anglais)
              </label>
              <input
                type="text"
                id="titleEn"
                required
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                placeholder="Enter title in English"
              />
            </div>

            <div>
              <label htmlFor="excerptEn" className="block text-sm font-medium text-gray-700 mb-2">
                Extrait (anglais)
              </label>
              <textarea
                id="excerptEn"
                required
                rows={3}
                value={formData.excerptEn}
                onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-500"
                placeholder="Short summary of the story in English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu (anglais)
              </label>
              <RichTextEditor
                content={formData.contentEn}
                onChange={(content) => setFormData({ ...formData, contentEn: content })}
              />
            </div>
          </div>
        )}

        {/* Common fields */}
        <div className="pt-6 border-t border-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
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
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder:text-gray-500"
              placeholder="Tags séparés par des virgules"
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
                Publié
              </label>
            </div>

            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date de publication
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
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
