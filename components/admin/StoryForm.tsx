'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Story } from '@/lib/db';

interface StoryFormProps {
  story?: Story;
}

export default function StoryForm({ story }: StoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="A short summary of the story..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
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
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="magic, adventure, fantasy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
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
              Published
            </label>
          </div>

          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              id="publishDate"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          {isSubmitting ? 'Saving...' : story ? 'Update Story' : 'Create Story'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
