import type { MetadataRoute } from 'next'
import { getEquipment, slugify, SITE } from '@/lib/equipment'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/offerings`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/equipment`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const items = await getEquipment()
  const itemPages: MetadataRoute.Sitemap = items
    .filter(i => !i.sold)
    .map(i => ({
      url: `${SITE}/equipment/${slugify(i.name)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...itemPages]
}
