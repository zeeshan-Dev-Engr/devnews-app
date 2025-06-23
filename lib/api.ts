import type { Article } from "./types"

const API_URL = "https://dev.to/api"

interface GetArticlesParams {
  tag?: string | null
  query?: string | null
  page?: number
  per_page?: number
}

interface RawArticle {
  tags?: string | string[] | null
  tag_list?: string[]
  positive_reactions_count?: number
  comments_count?: number
  public_reactions_count?: number
  reading_time_minutes?: number
  user?: {
    name?: string
    username?: string
    twitter_username?: string | null
    github_username?: string | null
    website_url?: string | null
    profile_image?: string | null
    profile_image_90?: string | null
  }
  [key: string]: unknown 
}

function normalizeArticle(article: RawArticle): Article {
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
    id: typeof article.id === "number" ? article.id : 0,
    title: typeof article.title === "string" ? article.title : "Untitled",
    description: typeof article.description === "string" ? article.description : "",
    slug: typeof article.slug === "string" ? article.slug : "",
    url: typeof article.url === "string" ? article.url : "",
    published_at: typeof article.published_at === "string" ? article.published_at : "",
    edited_at: typeof article.edited_at === "string" || article.edited_at === null ? article.edited_at : null,
    cover_image: typeof article.cover_image === "string" ? article.cover_image : null,
    social_image: typeof article.social_image === "string" ? article.social_image : null,
    canonical_url: typeof article.canonical_url === "string" ? article.canonical_url : "",
    tags,
    body_html: typeof article.body_html === "string" ? article.body_html : undefined,
    body_markdown: typeof article.body_markdown === "string" ? article.body_markdown : undefined,
    positive_reactions_count: article.positive_reactions_count || 0,
    comments_count: article.comments_count || 0,
    public_reactions_count: article.public_reactions_count || 0,
    page_views_count: typeof article.page_views_count === "number" ? article.page_views_count : null,
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

    if (tag) params.append("tag", tag)
    if (query) params.append("search", query)

    params.append("page", page.toString())
    params.append("per_page", per_page.toString())

    const response = await fetch(`${API_URL}/articles?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`)
    }

    const data: RawArticle[] = await response.json()
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
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch article: ${response.status}`)
    }

    const data: RawArticle = await response.json()
    return normalizeArticle(data)
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error)
    throw error
  }
}
