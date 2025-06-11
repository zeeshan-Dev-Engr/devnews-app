export interface Article {
  id: number
  title: string
  description: string
  slug: string
  url: string
  published_at: string
  edited_at: string | null
  cover_image: string | null
  social_image: string | null
  canonical_url: string
  tags: string[] | string | null
  body_html?: string
  body_markdown?: string
  positive_reactions_count: number
  comments_count: number
  public_reactions_count: number
  page_views_count: number | null
  reading_time_minutes: number
  user: {
    name: string
    username: string
    twitter_username: string | null
    github_username: string | null
    website_url: string | null
    profile_image: string | null
    profile_image_90: string | null
  }
}
