"use client";
import { useRef, useState } from "react";
import { resolveImageUrl } from "@/lib/api";

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--gold)" style={{ marginLeft: 3 }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// Figures out what kind of link was pasted (or file was uploaded) and
// returns how to embed it. YouTube/Vimeo need an <iframe> to their player;
// anything else is treated as a direct video file for a native <video> tag.
function resolveVideoEmbed(rawUrl) {
  if (!rawUrl) return null;

  const youtubeMatch = rawUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (youtubeMatch) {
    return { type: "iframe", src: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0` };
  }

  const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { type: "iframe", src: `https://player.vimeo.com/video/${vimeoMatch[1]}?badge=0&autopause=0&playsinline=1&dnt=1` };
  }

  // Not a recognized page link — treat as a direct file (uploaded, or a
  // pasted .mp4/.webm/.mov URL) and resolve backend-relative upload paths.
  return { type: "file", src: resolveImageUrl(rawUrl) };
}

// Fills the .hero-media box completely at whatever resolution the video
// actually is — no artificial downscaling — and stays paused behind a
// play button until the visitor clicks it (for direct files; YouTube/
// Vimeo embeds bring their own player controls, including play).
export default function HeroVideo({ videoUrl }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const embed = resolveVideoEmbed(videoUrl);

  if (!embed) {
    return null;
  }

  if (embed.type === "iframe") {
    return (
      <iframe
        src={embed.src}
        title="Hero video"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    );
  }

  function handlePlayClick() {
    videoRef.current?.play();
    setPlaying(true);
  }

  return (
    <>
      <video
        ref={videoRef}
        src={embed.src}
        playsInline
        controls={playing}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlayClick}
          aria-label="Play video"
          className="play"
          style={{ position: "absolute" }}
        >
          <PlayIcon />
        </button>
      )}
    </>
  );
}
