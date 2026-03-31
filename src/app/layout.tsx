import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { OfflineProvider } from "@/components/offline-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://qrtanki.com'),
  title: {
    default: "QR Tanki - Water Tank Cleaning Management Platform",
    template: "%s | QR Tanki"
  },
  description: "India's first QR-based water tank cleaning management platform. Generate QR codes, track cleaning history, subscribe to regular maintenance, and ensure clean water with professional services.",
  keywords: [
    "QR Tanki",
    "water tank cleaning",
    "QR code tracking",
    "water hygiene",
    "tank cleaning services",
    "subscription plans",
    "professional cleaners",
    "water purification",
    "tank maintenance",
    "hygiene monitoring",
    "digital certificates",
    "water safety",
    "cleaning management",
    "QR technology",
    "smart cleaning",
    "water tank monitoring",
    "hygiene scoring",
    "cleaning schedules",
    "water quality",
    "tank inspection",
    "cleaning verification"
  ],
  authors: [{ name: "QR Tanki Team", url: "https://qrtanki.com/team" }],
  creator: "QR Tanki Team",
  publisher: "QR Tanki Technologies",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    other: [
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/icons/icon-192x192.png" },
      { rel: "icon", sizes: "32x32", type: "image/png", url: "/favicon.svg" },
      { rel: "icon", sizes: "16x16", type: "image/png", url: "/favicon.svg" }
    ]
  },
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  colorScheme: "light",
  appleWebApp: {
    capable: true,
    title: "QR Tanki",
    statusBarStyle: "default",
    startupImage: {
      url: "/icons/icon-512x512.png",
      media: "(device-width: 768px) and (device-height: 1024px)"
    }
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://qrtanki.com",
    title: "QR Tanki - India's First QR-Based Water Tank Cleaning Platform",
    description: "Transform water tank maintenance with QR codes. Professional cleaning services, real-time tracking, digital certificates, and subscription plans for clean, safe water.",
    siteName: "QR Tanki",
    images: [
      {
        url: "https://qrtanki.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Tanki - Water Tank Cleaning Management Platform",
        type: "image/png"
      },
      {
        url: "https://qrtanki.com/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "QR Tanki Logo",
        type: "image/png"
      }
    ],
    videos: [
      {
        url: "https://qrtanki.com/demo-video.mp4",
        width: 1280,
        height: 720,
        alt: "QR Tanki Platform Demo",
        type: "video/mp4"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@qrtanki",
    creator: "@qrtanki",
    title: "QR Tanki - India's First QR-Based Water Tank Cleaning Platform",
    description: "Transform water tank maintenance with QR codes. Professional services, real-time tracking, digital certificates.",
    images: [
      "https://qrtanki.com/og-image.png",
      "https://qrtanki.com/icons/icon-512x512.png"
    ],
    video: "https://qrtanki.com/demo-video.mp4"
  },
  appLinks: {
    web: {
      url: "https://qrtanki.com",
      should_fallback: false
    },
    ios: {
      url: "https://apps.apple.com/app/qrtanki",
      app_store_id: "com.qrtanki.app"
    },
    android: {
      url: "https://play.google.com/store/apps/details?id=com.qrtanki.app",
      package: "com.qrtanki.app"
    }
  },
  alternates: {
    canonical: "https://qrtanki.com",
    languages: {
      "en-US": "https://qrtanki.com/en",
      "hi-IN": "https://qrtanki.com/hi",
      "mr-IN": "https://qrtanki.com/mr"
    }
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    bing: "your-bing-verification-code"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      noimageindex: false,
      nosnippet: false,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
      "max-video-preview": -1
    },
    otherBot: {
      index: true,
      follow: true,
      noimageindex: false,
      noimageindex: false,
      nosnippet: false
    }
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "QR Tanki",
    "application-name": "QR Tanki",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QR Tanki" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>
          <OfflineProvider>
            {children}
            <Toaster />
          </OfflineProvider>
        </Providers>
      </body>
    </html>
  );
}
