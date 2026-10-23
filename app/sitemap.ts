import { MetadataRoute } from 'next';

import presentations, { presentationPath } from '@/data/presentations';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // vinext prerenders a dynamic metadata route for `output: 'export'` only
  // when it is a public "use cache" function; without this the export ships
  // no sitemap.xml at all.
  'use cache';

  // Generate entries for blog posts
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const talkEntries: MetadataRoute.Sitemap = presentations.map((talk) => ({
    url: `${SITE_URL}${presentationPath(talk)}`,
    lastModified: new Date(talk.date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resume/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/writing/`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/presentations/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/trabalhe-comigo/`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contato/`,
      changeFrequency: 'yearly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacidade/`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...talkEntries,
    ...postEntries,
  ];
}
