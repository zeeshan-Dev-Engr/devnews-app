import type { Article } from "./types"

const API_URL = "https://dev.to/api"

interface GetArticlesParams {
  tag?: string | null
  query?: string | null
  page?: number
  per_page?: number
}

function normalizeArticle(article: any): Article {
  // Handle tags - they might be a string, array, or null
  let tags: string[] = []
  if (typeof article.tags === "string") {
    tags = article.tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean)
  } else if (Array.isArray(article.tags)) {
    tags = article.tags
  } else if (article.tag_list && Array.isArray(article.tag_list)) {
    tags = article.tag_list
  }

  return {
    ...article,
    tags,
    positive_reactions_count: article.positive_reactions_count || 0,
    comments_count: article.comments_count || 0,
    public_reactions_count: article.public_reactions_count || 0,
    reading_time_minutes: article.reading_time_minutes || 1,
    user: {
      name: article.user?.name || "Anonymous",
      username: article.user?.username || "anonymous",
      twitter_username: article.user?.twitter_username || null,
      github_username: article.user?.github_username || null,
      website_url: article.user?.website_url || null,
      profile_image: article.user?.profile_image || null,
      profile_image_90: article.user?.profile_image_90 || null,
    },
  }
}

export async function getArticles({
  tag = null,
  query = null,
  page = 1,
  per_page = 12,
}: GetArticlesParams): Promise<Article[]> {
  try {
    const params = new URLSearchParams()

    if (tag) {
      params.append("tag", tag)
    }

    if (query) {
      params.append("search", query)
    }

    params.append("page", page.toString())
    params.append("per_page", per_page.toString())

    const response = await fetch(`${API_URL}/articles?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`)
    }

    const data = await response.json()
    return data.map(normalizeArticle)
  } catch (error) {
    console.error("Error fetching articles:", error)
    throw error
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_URL}/articles/${slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch article: ${response.status}`)
    }

    const data = await response.json()
    return normalizeArticle(data)
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error)
    throw error
  }
}
