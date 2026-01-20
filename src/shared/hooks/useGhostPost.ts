/**
 * useGhostPost - React hook for fetching Ghost CMS posts
 * Handles loading, error states, and cleanup automatically
 */

import { useEffect, useState } from "react";
import { fetchGhostPostBySlug, fetchGhostPosts, fetchGhostPostHTML } from "../services/ghostService";

interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  plaintext?: string;
  excerpt?: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}



interface UseGhostPostReturn {
  post: GhostPost | null;
  html: string;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a single Ghost post
 * @param slug - Post slug to fetch
 * @param enabled - Whether to fetch (default: true)
 * @returns Object with post, html, loading, and error states
 */
export const useGhostPostBySlug = (
  slug: string,
  enabled: boolean = true
): UseGhostPostReturn => {
  const [post, setPost] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !slug) {
      setPost(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchGhostPostBySlug(slug)
      .then((data) => {
        if (mounted) {
          if (data) {
            setPost(data);
            setError(null);
          } else {
            setError(`Post "${slug}" not found`);
          }
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch post");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug, enabled]);

  return {
    post,
    html: post?.html || "",
    loading,
    error,
  };
};

/**
 * Hook to fetch multiple Ghost posts
 * @param limit - Number of posts to fetch (default: 1)
 * @param filter - Ghost filter syntax
 * @param enabled - Whether to fetch (default: true)
 * @returns Object with posts array, loading, and error states
 */
export const useGhostPosts = (
  limit: number = 1,
  filter?: string,
  enabled: boolean = true
): { posts: GhostPost[]; loading: boolean; error: string | null } => {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setPosts([]);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchGhostPosts(limit, filter)
      .then((data) => {
        if (mounted) {
          setPosts(data.posts || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch posts");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [limit, filter, enabled]);

  return { posts, loading, error };
};

/**
 * Hook to fetch Ghost post HTML only (for Terms & Conditions, etc.)
 * @param query - Custom query string
 * @param enabled - Whether to fetch (default: true)
 * @returns Object with html, loading, and error states
 */
export const useGhostPostHTML = (
  query: string = "limit=1",
  enabled: boolean = true
): { html: string; loading: boolean; error: string | null } => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !query) {
      setHtml("");
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchGhostPostHTML(query)
      .then((data) => {
        if (mounted) {
          setHtml(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch post HTML");
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [query, enabled]);

  return { html, loading, error };
};

export default {
  useGhostPostBySlug,
  useGhostPosts,
  useGhostPostHTML,
};
