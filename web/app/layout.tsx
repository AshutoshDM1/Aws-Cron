import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"
import { Titillium_Web } from "next/font/google"
import { Ubuntu } from "next/font/google"

const titilliumWeb = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
  variable: "--font-titillium",
})

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
})

const siteUrl = "https://aws-cron.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), 
  title: {
    default: "Elite Cron - Website Monitoring & Uptime Tracker ",
    template: "%s | AWS Cron - Website Monitoring"
  },
  description:
    "Monitor your site with AWS Cron - a uptime monitoring service featuring cron job scheduling, response time tracking and comprehensive analytics dashboard",
  keywords: [
    "website monitoring",
    "uptime monitor", 
    "cron job scheduler",
    "site monitoring service",
    "website uptime checker",
    "server monitoring tool",
    "ping monitor",
    "website health check",
    "uptime tracking dashboard",
    "response time monitoring",
    "website availability monitoring",
    "automated cron scheduler",
    "web service monitoring",
    "downtime alerts",
    "performance monitoring tool",
    "aws cron monitoring",
    "real-time monitoring dashboard",
    "website status checker",
    "server uptime monitoring",
    "http monitoring",
    "ssl monitoring",
    "api monitoring",
    "synthetic monitoring",
    "infrastructure monitoring",
    "devops monitoring tools",
    "site reliability engineering",
    "monitoring as a service",
    "cloud monitoring",
    "application monitoring"
  ],
  authors: [{ name: "AWS Cron Team", url: siteUrl }],
  creator: "AWS Cron",
  publisher: "AWS Cron",
  applicationName: "AWS Cron",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Replace with actual verification code
    // yandex: "your-yandex-verification-code", // Uncomment and add if needed
    // bing: "your-bing-verification-code", // Uncomment and add if needed
  },
  icons: {
    icon: [
      { url: "/favicon.webp", sizes: "16x16", type: "image/png" },
      { url: "/favicon.webp", sizes: "32x32", type: "image/png" },
      { url: "/favicon.webp", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.webp", sizes: "57x57", type: "image/png" },
      { url: "/favicon.webp", sizes: "60x60", type: "image/png" },
      { url: "/favicon.webp", sizes: "72x72", type: "image/png" },
      { url: "/favicon.webp", sizes: "76x76", type: "image/png" },
      { url: "/favicon.webp", sizes: "114x114", type: "image/png" },
      { url: "/favicon.webp", sizes: "120x120", type: "image/png" },
      { url: "/favicon.webp", sizes: "144x144", type: "image/png" },
      { url: "/favicon.webp", sizes: "152x152", type: "image/png" },
      { url: "/favicon.webp", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.webp",
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.webp",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "AWS Cron - Professional Website Monitoring & Uptime Tracker",
    description:
      "Monitor your websites 24/7 with AWS Cron - a powerful uptime monitoring service featuring cron job scheduling, real-time alerts, response time tracking, comprehensive analytics dashboard, and 99.9% reliability.",
    siteName: "AWS Cron",
    images: [
      {
        url: "/website.png",
        width: 1200,
        height: 630,
        alt: "AWS Cron - Website Monitoring Dashboard showing uptime statistics and real-time alerts",
        type: "image/png",
      },
      {
        url: "/favicon.webp",
        width: 512,
        height: 512,
        alt: "AWS Cron Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS Cron - Professional Website Monitoring & Uptime Tracker",
    description:
      "Monitor your websites 24/7 with AWS Cron - featuring cron job scheduling, real-time alerts, response time tracking, and comprehensive analytics dashboard.",
    site: "@AWSCron",
    creator: "@AWSCron",
    images: [
      {
        url: "/website.png",
        alt: "AWS Cron - Website Monitoring Dashboard",
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "en-GB": `${siteUrl}/en-gb`,
      "en-CA": `${siteUrl}/en-ca`,
      "en-AU": `${siteUrl}/en-au`,
      "es-ES": `${siteUrl}/es`,
      "es-MX": `${siteUrl}/es-mx`,
      "fr-FR": `${siteUrl}/fr`,
      "fr-CA": `${siteUrl}/fr-ca`,
      "de-DE": `${siteUrl}/de`,
      "it-IT": `${siteUrl}/it`,
      "pt-BR": `${siteUrl}/pt-br`,
      "pt-PT": `${siteUrl}/pt`,
      "nl-NL": `${siteUrl}/nl`,
      "ja-JP": `${siteUrl}/ja`,
      "ko-KR": `${siteUrl}/ko`,
      "zh-CN": `${siteUrl}/zh-cn`,
      "zh-TW": `${siteUrl}/zh-tw`,
      "ru-RU": `${siteUrl}/ru`,
      "ar-SA": `${siteUrl}/ar`,
      "hi-IN": `${siteUrl}/hi`,
      "x-default": siteUrl,
    },
  },
  category: "Technology",
  classification: "Website Monitoring & DevOps Tools",
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "AWS Cron",
    "application-name": "AWS Cron",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AWS Cron",
  "description": "Professional website monitoring and uptime tracking service with cron job scheduling, real-time alerts, and comprehensive analytics dashboard.",
  "url": siteUrl,
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "creator": {
    "@type": "Organization",
    "name": "AWS Cron",
    "url": siteUrl
  },
  "featureList": [
    "Website Monitoring",
    "Uptime Tracking", 
    "Cron Job Scheduling",
    "Real-time Alerts",
    "Response Time Monitoring",
    "Analytics Dashboard",
    "Performance Monitoring",
    "Automated Health Checks"
  ],
  "screenshot": `${siteUrl}/website.png`,
  "softwareVersion": "1.0.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className={`${titilliumWeb.variable} ${ubuntu.variable} font-ubuntu`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
