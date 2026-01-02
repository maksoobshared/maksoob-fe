import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API } from "./apis";
import { getAccessToken } from "./cookies";

// Helper to read a cookie value by name in the browser
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function resolveAcceptLanguage(): "ar" | "en" {
  if (typeof document === "undefined") return "ar";
  const lang = (
    document.documentElement.getAttribute("lang") ?? ""
  ).toLowerCase();
  return lang.startsWith("en") ? "en" : "ar";
}

// Returns auth token from cookies. Assumption: cookie name is 'token'.
// Change the cookie name below if your project uses a different name (e.g., 'access_token').
export function getAuthTokenFromCookie(): string | null {
  // Try common cookie names; adjust as needed
  return getCookie("token") || getCookie("access_token") || null;
}

// Create a shared axios instance with the API base URL. We'll attach an interceptor
// to automatically add the Authorization header when token cookie exists.
const instance: AxiosInstance = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach bearer token from cookie when available.
instance.interceptors.request.use((config) => {
  try {
    config.headers = {
      ...(config.headers as Record<string, any>),
      "Accept-Language": resolveAcceptLanguage(),
    } as any;

    const token = getAccessToken();
    if (token) {
      // preserve existing headers and add Authorization. Cast to any to satisfy axios header typing.
      config.headers = {
        ...(config.headers as Record<string, any>),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  } catch (e) {
    // swallow cookie-read errors silently — requests proceed without Authorization
  }
  return config;
});

// Basic GET wrapper.
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await instance.get<T>(url, config);
  return res.data;
}

// Basic POST wrapper.
export async function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await instance.post<T>(url, data, config);
  return res.data;
}

// Basic PUT wrapper.
export async function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await instance.put<T>(url, data, config);
  return res.data;
}

export default instance;
