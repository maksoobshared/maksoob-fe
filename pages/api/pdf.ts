import type { NextApiRequest, NextApiResponse } from "next";

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function isAllowedPdfUrl(url: URL) {
  if (url.protocol !== "https:") return false;

  // Minimal allowlist to reduce SSRF risk. Extend as needed.
  const host = url.hostname.toLowerCase();
  if (host === "maksoob-dev-bucket.s3.me-central-1.amazonaws.com") return true;
  if (host.endsWith(".amazonaws.com")) return true;

  return false;
}

function shouldForwardBearerToHost(hostname: string) {
  const host = hostname.toLowerCase();

  // S3 (and many object stores) will reject arbitrary Authorization headers.
  if (host.endsWith(".amazonaws.com")) return false;
  if (host.includes(".s3.")) return false;

  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const raw = req.query.url;
  const urlString = Array.isArray(raw) ? raw[0] : raw;

  if (!urlString) {
    return res.status(400).json({ message: "Missing url" });
  }

  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return res.status(400).json({ message: "Invalid url" });
  }

  if (!isAllowedPdfUrl(url)) {
    return res.status(400).json({ message: "URL not allowed" });
  }

  try {
    // Optional: if the remote is behind Bearer auth and we have a cookie token, forward it.
    const token = getCookieValue(req.headers.cookie, "access_token");

    const forwardBearer = token && shouldForwardBearerToHost(url.hostname);

    const upstream = await fetch(url.toString(), {
      headers: {
        ...(forwardBearer ? { Authorization: `Bearer ${token}` } : null),
      } as Record<string, string>,
    });

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ message: `Upstream error: ${upstream.status}` });
    }

    const contentType =
      upstream.headers.get("content-type") || "application/pdf";

    // Buffer response (simple + reliable in Next API routes)
    const arrayBuffer = await upstream.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (e) {
    return res.status(500).json({ message: "Failed to fetch PDF" });
  }
}
