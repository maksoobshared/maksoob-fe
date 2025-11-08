export const API = process.env.NEXT_PUBLIC_API_URL || "https://37.60.243.151/";
// Base for v1 endpoints — use `${API_V1}/auth/...` in services
export const API_V1 = `${API.replace(/\/$/, "")}/api/v1`;
