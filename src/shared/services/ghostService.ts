/**
 * Ghost CMS Content API Service
 * Fetches posts and content from Ghost-hosted CMS
 */

interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  plaintext?: string;
  feature_image?: string;
  excerpt?: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

interface GhostResponse {
  posts: GhostPost[];
}

const GHOST_API_URL = (import.meta.env.VITE_GHOST_API_URL as string) || "https://d35xjwn52ivqj7.cloudfront.net/ghost/api/content";
const GHOST_API_KEY = (import.meta.env.VITE_GHOST_API_KEY as string) || "895e050f96719a6f662b400501";

/**
 * Fetch a single Ghost post by slug
 * @param slug - Post slug (URL-friendly identifier)
 * @returns Promise<GhostPost | null>
 */
export const fetchGhostPostBySlug = async (slug: string): Promise<GhostPost | null> => {
  try {
    const url = `${GHOST_API_URL}/posts/slug/${slug}/?key=${GHOST_API_KEY}&fields=html,title,excerpt,plaintext`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: { posts: GhostPost[] } = await response.json();
    return data.posts?.[0] || null;
  } catch (error) {
    console.error(`[Ghost] Failed to fetch post "${slug}":`, error);
    return null;
  }
};

/**
 * Fetch Ghost posts with limit and optional filter
 * @param limit - Number of posts to fetch (default: 1)
 * @param filter - Ghost filter syntax (e.g., "tag:terms-and-conditions")
 * @returns Promise<GhostResponse>
 */
export const fetchGhostPosts = async (
  limit: number = 1,
  filter?: string
): Promise<GhostResponse> => {
  try {
    let url = `${GHOST_API_URL}/posts/?key=${GHOST_API_KEY}&limit=${limit}&fields=html,title,excerpt,plaintext`;
    if (filter) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("[Ghost] Failed to fetch posts:", error);
    return { posts: [] };
  }
};

/**
 * Fetch Ghost post by custom filter (legacy support)
 * Fetches the first post matching query params (e.g., ?limit=1)
 * @param customQuery - Custom query string to append to API URL
 * @returns Promise<string> - HTML content of first post or empty string
 */
export const fetchGhostPostHTML = async (customQuery: string = ""): Promise<string> => {
  try {
    const url = `${GHOST_API_URL}/posts/?key=${GHOST_API_KEY}&${customQuery}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: GhostResponse = await response.json();
    return data.posts?.[0]?.html || "";
  } catch (error) {
    console.error("[Ghost] Failed to fetch post HTML:", error);
    return "";
  }
};

export default {
  fetchGhostPostBySlug,
  fetchGhostPosts,
  fetchGhostPostHTML,
};
