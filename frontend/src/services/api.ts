import { supabase } from "@/lib/supabase";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Skip auth header (for unauthenticated endpoints) */
  skipAuth?: boolean;
}

/**
 * Get a fresh access token, refreshing the session if needed.
 */
async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  // Check if token expires within the next 60 seconds
  const expiresAt = session.expires_at ?? 0;
  const isExpiringSoon = expiresAt - Math.floor(Date.now() / 1000) < 60;

  if (isExpiringSoon) {
    const { data } = await supabase.auth.refreshSession();
    return data.session?.access_token ?? null;
  }

  return session.access_token;
}

/**
 * Core API request function.
 * Automatically attaches Supabase JWT auth header to all requests.
 * Retries once on 401 after refreshing the token.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, skipAuth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = { method, headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // On 401, try refreshing the token and retry once
  if (response.status === 401 && !skipAuth) {
    const { data } = await supabase.auth.refreshSession();
    const newToken = data.session?.access_token;
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Upload a file via FormData (photos, PDFs).
 * Auth header is attached automatically.
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const headers: Record<string, string> = {};

  const token = await getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Note: Do NOT set Content-Type for FormData — fetch sets it with boundary

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Upload failed with status ${response.status}`
    );
  }

  return response.json();
}
