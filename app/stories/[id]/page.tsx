import { getStoryById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import SocialLinks from '@/components/SocialLinks';
import StoryContent from '@/components/story/StoryContent';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(parseInt(id));

  if (!story || !story.published) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: `${story.title_fr} | Esolrine Stories`,
    description: story.excerpt_fr,
    openGraph: {
      title: story.title_fr,
      description: story.excerpt_fr,
      type: 'article',
      publishedTime: new Date(story.publish_date).toISOString(),
      authors: ['Esolrine'],
      images: story.cover_image
        ? [
            {
              url: story.cover_image,
              width: 1200,
              height: 630,
              alt: story.title_fr,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title_fr,
      description: story.excerpt_fr,
      images: story.cover_image ? [story.cover_image] : [],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getStoryById(parseInt(id));

  if (!story || !story.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <nav className="mb-8 max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour aux histoires
          </Link>
        </nav>

        <StoryContent story={story} />

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 mb-4 text-sm">
              Suivez Esolrine pour plus d&apos;histoires
            </p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
