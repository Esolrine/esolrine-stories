import { MetadataRoute } from 'next';
import { getStories } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://esolrine.com';
  const stories = await getStories(true);

  const storyUrls = stories.map((story) => ({
    url: `${baseUrl}/stories/${story.id}`,
    lastModified: new Date(story.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...storyUrls,
  ];
}
