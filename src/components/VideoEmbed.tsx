import { useState } from "react";
import { Play, X } from "lucide-react";

/** Convierte un link de YouTube/Vimeo/Instagram a un embed src; null si no se pudo. */
export function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    // Instagram reel/post
    if (u.hostname.includes("instagram.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      // /reel/{id} o /p/{id} o /reels/{id}
      if (parts.length >= 2) return `https://www.instagram.com/${parts[0]}/${parts[1]}/embed`;
    }
    // mp4 directo
    if (/\.mp4($|\?)/i.test(url)) return url;
  } catch {}
  return null;
}

export function VideoEmbed({ url, className = "" }: { url: string; className?: string }) {
  const embed = toEmbedUrl(url);
  if (!embed) return null;
  if (/\.mp4($|\?)/i.test(embed)) {
    return <video src={embed} controls className={`w-full h-full ${className}`} />;
  }
  return (
    <iframe
      src={embed}
      title="video"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      className={`w-full h-full border-0 ${className}`}
    />
  );
}

/** Botón play que abre un modal con el video. */
export function VideoModalTrigger({ url, children }: { url: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="absolute inset-0 grid place-items-center group/play">
        {children ?? (
          <span className="h-14 w-14 rounded-full bg-white/95 grid place-items-center shadow-xl group-hover/play:scale-110 transition-transform">
            <Play size={22} className="text-primary ml-0.5" fill="currentColor" />
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 z-10 bg-white/90 text-foreground rounded-full p-2">
              <X size={16} />
            </button>
            <VideoEmbed url={url} />
          </div>
        </div>
      )}
    </>
  );
}
