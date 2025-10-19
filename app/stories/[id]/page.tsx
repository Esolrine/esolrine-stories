import { getStoryById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import SocialLinks from '@/components/SocialLinks';

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
    title: `${story.title} | Esolrine`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      publishedTime: new Date(story.publish_date).toISOString(),
      authors: ['Esolrine'],
      images: story.cover_image
        ? [
            {
              url: story.cover_image,
              width: 1200,
              height: 630,
              alt: story.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.excerpt,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Stories
          </Link>
        </nav>

        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {story.cover_image && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={story.cover_image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {story.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {story.tags && story.tags.length > 0 && story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(story.publish_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </header>

            <div
              className="prose prose-lg prose-emerald max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </div>
        </article>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enjoyed this story?
            </h2>
            <p className="text-gray-600 mb-6">
              Follow Esolrine for more stories from this magical world
            </p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
