import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DevNews. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">Powered by the Dev.to API</p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yourusername/dev-news-aggregator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
