// Simple client-side cookie helpers for access_token handling
// Note: these functions are client-side only (they check for `document`).

type SetOptions = {
  days?: number; // days until expiry
  path?: string;
  secure?: boolean;
  sameSite?: "Lax" | "Strict" | "None";
};

const COOKIE_NAME = "access_token";

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export function setAccessToken(token: string, options?: SetOptions) {
  if (typeof document === "undefined") return;
  const days = options?.days ?? 7;
  const path = options?.path ?? "/";
  const secure = options?.secure ?? location.protocol === "https:";
  const sameSite = options?.sameSite ?? "Lax";
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  let cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Expires=${expires}; Path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += "; Secure";
  // We don't set HttpOnly because this is client-side JS; for security consider setting HttpOnly on server
  document.cookie = cookie;
}

export function clearAccessToken() {
  if (typeof document === "undefined") return;
  // Set cookie expiry in the past to remove
  document.cookie = `${COOKIE_NAME}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;`;
}

const cookies = {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
};

export default cookies;
