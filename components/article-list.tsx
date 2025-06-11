"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { getArticles } from "@/lib/api"
import ArticleCard from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"
import type { Article } from "@/lib/types"

export default function ArticleList() {
  const searchParams = useSearchParams()
  const tag = searchParams.get("tag")
  const query = searchParams.get("query")
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  // Reset when filters change
  useEffect(() => {
    setArticles([])
    setPage(1)
    setHasMore(true)
    setError(null)
  }, [tag, query])

  // Initial load and when filters change
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getArticles({ tag, query, page: 1, per_page: 12 })
        setArticles(data)
        setHasMore(data.length === 12)
      } catch (err) {
        setError("Failed to load articles. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [tag, query])

  // Load more when scrolling to the bottom

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    try {
      setLoading(true)
      const nextPage = page + 1
      const data = await getArticles({ tag, query, page: nextPage, per_page: 12 })

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setArticles((prev) => [...prev, ...data])
        setPage(nextPage)
        setHasMore(data.length === 12)
      }
    } catch (err) {
      setError("Failed to load more articles. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, tag, query])

  useEffect(() => {
    if (inView && !loading && hasMore && page > 1) {
      loadMore()
    }
  }, [inView, loading, hasMore, page, loadMore])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (articles.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <Button asChild variant="outline">
          <Link href="/">Clear Filters</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
       {articles.map((article, index) => (
  <motion.div
    key={`${article.id}-${index}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <ArticleCard article={article} />
  </motion.div>
))}

      </motion.div>

      {hasMore && (
        <div ref={ref} className="flex justify-center mt-12 mb-8">
          <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading..." : "Load More Articles"}
          </Button>
        </div>
      )}
    </>
  )
}
