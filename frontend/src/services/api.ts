const API_BASE_URL = "http://192.168.0.8:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

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
