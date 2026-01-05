import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Spinner } from "@/components/ui/spinner";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export type LessonPlayerType = "youtube" | "pdf" | string;

type LessonPlayerProps = {
  type?: LessonPlayerType;
  url?: string | null;
  title?: string;
};

function getYouTubeEmbedUrl(input: string): string | null {
  try {
    const u = new URL(input);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (!id) return null;
      return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }

    // youtube.com/watch?v=<id>
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;

      // youtube.com/embed/<id>
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${encodeURIComponent(
          parts[embedIndex + 1]
        )}`;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export function LessonPlayer({ type, url, title }: LessonPlayerProps) {
  const { t } = useTranslation("my-courses");

  const resolvedUrl = url?.trim();
  const looksLikePdf = Boolean(
    resolvedUrl && resolvedUrl.toLowerCase().split("?")[0]?.endsWith(".pdf")
  );

  const isPdf = type === "pdf" || looksLikePdf;

  const youtubeEmbedUrl = useMemo(
    () => (resolvedUrl ? getYouTubeEmbedUrl(resolvedUrl) : null),
    [resolvedUrl]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [useYoutubeIframeFallback, setUseYoutubeIframeFallback] =
    useState(false);

  useEffect(() => {
    // Whenever the media changes, show loader until it becomes ready.
    setIsLoading(true);
    setUseYoutubeIframeFallback(false);
  }, [resolvedUrl, isPdf]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.log("[LessonPlayer:init]", {
      type,
      title,
      resolvedUrl,
      isPdf,
      youtubeEmbedUrl,
    });
  }, [type, title, resolvedUrl, isPdf, youtubeEmbedUrl]);

  useEffect(() => {
    if (isPdf) return;
    if (!resolvedUrl) return;
    if (!youtubeEmbedUrl) return;
    if (!isLoading) return;
    if (useYoutubeIframeFallback) return;

    // If react-player doesn't resolve (no onReady/onError), fall back after a timeout.
    const timeout = window.setTimeout(() => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[LessonPlayer] switching to iframe fallback (timeout)", {
          resolvedUrl,
          youtubeEmbedUrl,
        });
      }
      setUseYoutubeIframeFallback(true);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [
    isLoading,
    isPdf,
    resolvedUrl,
    useYoutubeIframeFallback,
    youtubeEmbedUrl,
  ]);

  const proxiedPdfUrl =
    resolvedUrl != null
      ? `/api/pdf?url=${encodeURIComponent(resolvedUrl)}`
      : null;

  if (!resolvedUrl) {
    return (
      <div className="aspect-video w-full rounded-xl border border-border bg-card" />
    );
  }

  if (isPdf) {
    return (
      <div className="relative w-full rounded-xl border border-border bg-card overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner className="size-6 text-secondary" />
          </div>
        )}
        <iframe
          title={title || t("lessonPlayerPdfTitle")}
          src={proxiedPdfUrl ?? undefined}
          className="h-[70vh] w-full"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // Default to video player (YouTube supported out of the box)
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-video w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner className="size-6 text-secondary" />
          </div>
        )}

        {useYoutubeIframeFallback && youtubeEmbedUrl ? (
          <iframe
            title={title || t("lessonPlayerYoutubeTitle")}
            src={youtubeEmbedUrl}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => {
              if (process.env.NODE_ENV !== "production") {
                console.log("[LessonPlayer:youtube-iframe] loaded", {
                  youtubeEmbedUrl,
                });
              }
              setIsLoading(false);
            }}
          />
        ) : (
          <ReactPlayer
            className="absolute inset-0"
            url={resolvedUrl}
            width="100%"
            height="100%"
            controls
            onReady={() => {
              if (process.env.NODE_ENV !== "production") {
                console.log("[LessonPlayer:react-player] onReady", {
                  resolvedUrl,
                });
              }
              setIsLoading(false);
            }}
            onPlay={() => {
              if (process.env.NODE_ENV !== "production") {
                console.log("[LessonPlayer:react-player] onPlay", {
                  resolvedUrl,
                });
              }
            }}
            onError={(err) => {
              if (process.env.NODE_ENV !== "production") {
                console.log("[LessonPlayer:react-player] onError", {
                  resolvedUrl,
                  err,
                });
              }
              if (youtubeEmbedUrl) {
                setUseYoutubeIframeFallback(true);
                return;
              }
              setIsLoading(false);
            }}
            config={{
              youtube: {
                // @ts-expect-error: playerVars is valid
                playerVars: {
                  origin:
                    typeof window !== "undefined"
                      ? window.location.origin
                      : undefined,
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
