"use client";
import { ReactNode } from "react";

type Props = {
  src: string;
  poster?: string;
  /** true = sits inside the page width with rounded corners; false = edge to edge */
  contained?: boolean;
  maxWidth?: number;
  aspect?: string;
  /** crops in slightly to hide a corner watermark */
  zoom?: number;
  origin?: string;
  /** 0 = original colors, 0.4 = darker */
  overlay?: number;
  children?: ReactNode;
};

export default function VideoBanner({
  src,
  poster,
  contained = true,
  maxWidth = 2500,
  aspect = "16 / 9",
  zoom = 1,
  origin = "top left",
  overlay = 0,
  children,
}: Props) {
  return (
    <section style={{ padding: contained ? "16px 20px" : 0 }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: contained ? maxWidth : "none",
          margin: "0 auto",
          aspectRatio: aspect,
          borderRadius: contained ? 20 : 0,
          background: "#000",
        }}
      >
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: origin,
            pointerEvents: "none",
          }}
        />
        {overlay > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `rgba(0,0,0,${overlay})`,
            }}
          />
        )}
        {children && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              padding: 24,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
