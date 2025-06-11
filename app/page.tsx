import { Suspense } from "react"
import ArticleList from "@/components/article-list"
import FilterSection from "@/components/filter-section"
import { ErrorBoundary } from "@/components/error-boundary"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Trending Tech Articles</h1>
        <p className="text-muted-foreground">
          Discover the latest and most popular articles from the developer community
        </p>
      </section>

      <FilterSection />

      <ErrorBoundary>
        <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-2xl p-4 h-[400px] flex flex-col">
          <Skeleton className="w-full h-48 rounded-xl mb-4" />
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-full h-4 mb-1" />
          <Skeleton className="w-full h-4 mb-4" />
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="w-24 h-8 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
