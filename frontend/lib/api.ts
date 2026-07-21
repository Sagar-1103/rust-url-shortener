const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface BackendUrl {
  id: string;
  code: string;
  original_url: string;
  user_id: string;
  click_count: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  title?: string | null;
  archived?: boolean;
}

export interface DashboardStatsData {
  total_links: number;
  total_clicks: number;
  top_links: BackendUrl[];
  recent_links: BackendUrl[];
}

// Token helpers
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// Internal fetch wrapper with auto-refresh logic
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized (attempt token refresh)
    if (res.status === 401 && !isRetry && endpoint !== "/auth/login" && endpoint !== "/auth/signup" && endpoint !== "/auth/refresh") {
      const refreshed = await refreshTokens();
      if (refreshed) {
        return fetchApi<T>(endpoint, options, true);
      } else {
        clearTokens();
      }
    }

    const data: ApiResponse<T> = await res.json();
    if (!res.ok && !data.message) {
      return {
        success: false,
        message: `HTTP error ${res.status}`,
        data: null,
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network request failed",
      data: null,
    };
  }
}

// Auth API Calls
export async function loginApi(username: string, password: string): Promise<ApiResponse<Tokens>> {
  const res = await fetchApi<Tokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (res.success && res.data) {
    setTokens(res.data.access_token, res.data.refresh_token);
  }
  return res;
}

export async function signupApi(username: string, password: string): Promise<ApiResponse<Tokens>> {
  const res = await fetchApi<Tokens>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (res.success && res.data) {
    setTokens(res.data.access_token, res.data.refresh_token);
  }
  return res;
}

export async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;
    const data: ApiResponse<Tokens> = await res.json();
    if (data.success && data.data) {
      setTokens(data.data.access_token, data.data.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function logoutApi(): Promise<void> {
  await fetchApi<void>("/auth/logout", { method: "POST" });
  clearTokens();
}

export async function getProfileApi(): Promise<ApiResponse<UserProfile>> {
  return fetchApi<UserProfile>("/auth/profile");
}

// URL API Calls
export async function shortenUrlApi(url: string, title?: string): Promise<ApiResponse<BackendUrl>> {
  return fetchApi<BackendUrl>("/urls/shorten", {
    method: "POST",
    body: JSON.stringify({ url, title: title || undefined }),
  });
}

export async function getUrlsApi(): Promise<ApiResponse<BackendUrl[]>> {
  return fetchApi<BackendUrl[]>("/urls");
}

export async function getUrlApi(id: string): Promise<ApiResponse<BackendUrl>> {
  return fetchApi<BackendUrl>(`/urls/${id}`);
}

export async function deleteUrlApi(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/urls/${id}`, {
    method: "DELETE",
  });
}

export async function updateUrlTitleApi(id: string, title: string): Promise<ApiResponse<BackendUrl>> {
  return fetchApi<BackendUrl>(`/urls/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export async function toggleArchiveApi(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/urls/${id}/toggle-archive`, {
    method: "PATCH",
  });
}

export async function getDashboardStatsApi(): Promise<ApiResponse<DashboardStatsData>> {
  return fetchApi<DashboardStatsData>("/urls/stats");
}
