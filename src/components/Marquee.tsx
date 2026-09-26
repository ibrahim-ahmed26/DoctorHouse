"use client";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // seconds per full loop — lower = faster
  gap?: number; // px gap between items
  reverse?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 28,
  gap = 20,
  reverse = false,
  className,
}: MarqueeProps) {
  return (
    <div className={`marquee${className ? " " + className : ""}`}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="marquee-group" style={{ gap }}>
          {children}
        </div>
        <div className="marquee-group" aria-hidden="true" style={{ gap }}>
          {children}
        </div>
      </div>
    </div>
  );
}
