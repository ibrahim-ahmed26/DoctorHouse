"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: React.ReactNode;
  stagger?: number;
  y?: number;
  className?: string;
  [key: string]: any;
}

export default function Reveal({
  children,
  stagger = 0.12,
  y = 28,
  className,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const targets = ref.current.children;
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [stagger, y]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
