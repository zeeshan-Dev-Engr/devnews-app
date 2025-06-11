import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevNews - Trending Tech Articles",
  description: "A modern news aggregator for developers featuring trending tech articles from Dev.to",
  keywords: "dev.to, tech news, programming, web development, coding",
  openGraph: {
    title: "DevNews - Trending Tech Articles",
    description: "A modern news aggregator for developers featuring trending tech articles from Dev.to",
    url: "https://devnews.vercel.app",
    siteName: "DevNews",
    images: [
      {
        url: "https://devnews.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevNews - Trending Tech Articles",
      },
    ],
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="devnews-theme"
        >
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
