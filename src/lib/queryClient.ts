import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuthHeader } from "@/lib/auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper function to ensure URLs are properly formatted with the API prefix
function getApiUrl(url: string): string {
  // If URL already starts with http(s), use it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // If URL already has /api prefix, use it as is
  if (url.startsWith('/api')) {
    return url;
  }
  
  // Otherwise, add /api prefix
  return `/api${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const apiUrl = getApiUrl(url);
  
  // Create a Headers object for type safety
  const headers = new Headers();
  
  // Add content type if data is provided
  if (data) {
    headers.append("Content-Type", "application/json");
  }
  
  // Add auth header if token exists
  const authHeaders = getAuthHeader();
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.append(key, value);
  });
  
  const res = await fetch(apiUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const apiUrl = getApiUrl(url);
    
    // Get auth headers and explicitly cast as HeadersInit
    const headers: HeadersInit = getAuthHeader();
    
    const res = await fetch(apiUrl, {
      credentials: "include",
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
