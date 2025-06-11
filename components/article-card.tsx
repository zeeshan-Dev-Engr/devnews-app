"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { Article } from "@/lib/types"

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(article.positive_reactions_count)

  const publishedDate = new Date(article.published_at)
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true })

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full overflow-hidden flex flex-col border rounded-2xl hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 bg-card">
        <Link href={`/articles/${article.slug}`} className="flex-1 flex flex-col">
          {article.cover_image && (
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={article.cover_image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          <CardHeader className={article.cover_image ? "pt-4" : "pt-6"}>
            <h2 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors text-card-foreground">
              {article.title}
            </h2>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="text-muted-foreground line-clamp-3 mb-4">{article.description}</p>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(article.tags) && article.tags.length > 0 ? (
                <>
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </>
              ) : (
                <Badge variant="outline" className="text-xs">
                  No tags
                </Badge>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter className="flex items-center justify-between pt-4 pb-4 border-t border-border">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={article.published_at}>{timeAgo}</time>
          </div>

          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm hover:scale-105 transition-transform"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"}`}
            />
            <span className={isLiked ? "text-red-500" : "text-muted-foreground"}>{likeCount}</span>
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
