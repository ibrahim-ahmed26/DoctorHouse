"use client";
import { useEffect, useRef } from "react";

interface VideoBannerProps {
  src: string; // e.g. "/header-video.mp4"
  poster?: string; // optional still image shown until the video loads
  height?: string; // any CSS height, e.g. "100svh" for full screen
  zoom?: number; // >1 crops the right/bottom edges (hides the watermark)
  origin?: string; // which corner stays fixed while zooming
  overlay?: number; // 0 = none, 1 = solid navy
  children?: React.ReactNode; // optional text/buttons shown on top of the video
}

export default function VideoBanner({
  src,
  poster,
  height = "100svh",
  zoom = 1.15,
  origin = "top left",
  overlay = 0.45,
  children,
}: VideoBannerProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // some browsers ignore the attribute for autoplay

    const play = () => {
      v.play().catch(() => {});
    };
    const resume = () => {
      if (!document.hidden) play();
    };

    play();
    v.addEventListener("pause", resume);
    v.addEventListener("ended", play);
    document.addEventListener("visibilitychange", resume);
    // iOS Low Power Mode blocks autoplay until the first touch
    window.addEventListener("touchstart", play, { once: true, passive: true });
    window.addEventListener("click", play, { once: true });

    return () => {
      v.removeEventListener("pause", resume);
      v.removeEventListener("ended", play);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("touchstart", play);
      window.removeEventListener("click", play);
    };
  }, []);

  return (
    <div className="video-banner" style={{ height }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate nofullscreen"
        onContextMenu={(e) => e.preventDefault()}
        style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
      />
      <div
        className="video-banner-overlay"
        style={{
          background: `linear-gradient(180deg, rgba(27,38,58,${overlay * 0.75}) 0%, rgba(27,38,58,${overlay}) 100%)`,
        }}
      />
      {children && <div className="video-banner-content">{children}</div>}
    </div>
  );
}