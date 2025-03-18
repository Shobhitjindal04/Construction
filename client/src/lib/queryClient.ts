import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: RequestCredentials;
};

// Updated apiRequest to handle different parameter structures
export async function apiRequest(
  urlOrOptions: string | RequestOptions,
  options?: RequestOptions,
): Promise<any> {
  let url: string;
  let fetchOptions: RequestOptions = {
    credentials: "include",
  };

  if (typeof urlOrOptions === "string") {
    url = urlOrOptions;
    fetchOptions = { ...fetchOptions, ...options };
  } else {
    throw new Error("First parameter must be a URL string");
  }

  const res = await fetch(url, fetchOptions as RequestInit);
  await throwIfResNotOk(res);
  
  // Try to parse as JSON if the response has content
  if (res.headers.get("Content-Length") !== "0" && 
      res.headers.get("Content-Type")?.includes("application/json")) {
    return await res.json();
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
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
