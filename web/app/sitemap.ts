import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aws-cron.vercel.app'
  
  // Define your static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Add localized versions
  const languages = [
    'en-gb', 'en-ca', 'en-au', 'es', 'es-mx', 'fr', 'fr-ca', 
    'de', 'it', 'pt-br', 'pt', 'nl', 'ja', 'ko', 'zh-cn', 
    'zh-tw', 'ru', 'ar', 'hi'
  ]

  const localizedPages = staticPages.flatMap(page => 
    languages.map(lang => ({
      ...page,
      url: `${baseUrl}/${lang}${page.url.replace(baseUrl, '')}`,
      priority: page.priority * 0.9, // Slightly lower priority for localized versions
    }))
  )

  return [...staticPages, ...localizedPages]
}
