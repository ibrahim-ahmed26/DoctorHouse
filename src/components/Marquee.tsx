"use client";
import { Fragment } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // seconds for one pass of the original items — lower = faster
  gap?: number; // px gap between items
  reverse?: boolean;
  repeat?: number; // copies of the items per group, so a group is wider than the screen
  className?: string;
}

export default function Marquee({
  children,
  speed = 28,
  gap = 20,
  reverse = false,
  repeat = 3,
  className,
}: MarqueeProps) {
  const copies = Array.from({ length: repeat }, (_, i) => (
    <Fragment key={i}>{children}</Fragment>
  ));

  return (
    <div className={`marquee${className ? " " + className : ""}`}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed * repeat}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="marquee-group" style={{ gap, paddingInlineEnd: gap }}>
          {copies}
        </div>
        <div
          className="marquee-group"
          aria-hidden="true"
          style={{ gap, paddingInlineEnd: gap }}
        >
          {copies}
        </div>
      </div>
    </div>
  );
}
