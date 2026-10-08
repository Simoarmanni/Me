import { useEffect, useState, RefObject } from "react";

interface HeroAnimatedBackgroundProps {
  containerRef?: RefObject<HTMLElement | null>;
}

export function HeroAnimatedBackground({ containerRef }: HeroAnimatedBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isVisible = true;
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible || ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        const container = containerRef?.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
          const y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
          setMousePos({ x, y });
        } else {
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = (e.clientY / window.innerHeight) * 2 - 1;
          setMousePos({ x, y });
        }
        ticking = false;
      });
    };

    const container = containerRef?.current;
    let observer: IntersectionObserver | null = null;

    if (container && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [containerRef]);

  // Distinct parallax shifts for doodles
  const d1 = { x: mousePos.x * 20, y: mousePos.y * 20 };
  const d2 = { x: mousePos.x * -24, y: mousePos.y * -22 };
  const d3 = { x: mousePos.x * 16, y: mousePos.y * -18 };
  const d4 = { x: mousePos.x * -18, y: mousePos.y * 24 };
  const d5 = { x: mousePos.x * 26, y: mousePos.y * 14 };
  const d6 = { x: mousePos.x * -20, y: mousePos.y * -16 };
  const d7 = { x: mousePos.x * 14, y: mousePos.y * 26 };
  const d8 = { x: mousePos.x * -16, y: mousePos.y * 18 };

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none max-w-full w-full h-full"
      style={{ clipPath: "inset(0)" }}
    >
      {/* Soft Colorful Animated Glow Orbs in pastel blue-violet and warm accents */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-300/30 via-violet-300/25 to-sky-300/20 blur-3xl transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)` }}
      />
      <div
        className="absolute top-1/3 -left-20 w-88 h-88 rounded-full bg-gradient-to-tr from-sky-300/25 via-teal-300/20 to-indigo-200/20 blur-3xl transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -16}px, 0)` }}
      />
      <div
        className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-gradient-to-tl from-amber-300/25 via-rose-300/20 to-violet-300/20 blur-3xl transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)` }}
      />

      {/* DOODLE 1: Vintage Photo Camera (top-left) */}
      <div
        className="absolute top-8 left-4 sm:left-10 text-violet-600/70 dark:text-violet-400/60 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${d1.x}px, ${d1.y}px, 0)` }}
      >
        <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="14" width="36" height="26" rx="6" />
          <path d="M16 14l3-6h10l3 6" />
          <circle cx="24" cy="27" r="7" />
          <circle cx="34" cy="20" r="1.5" fill="currentColor" />
          <path d="M38 10l3-3M35 7l1-4M41 12l4 1" strokeWidth="1.8" />
        </svg>
      </div>

      {/* DOODLE 2: Speech Bubble with 'PR' / dots (top-right) */}
      <div
        className="absolute top-12 right-6 sm:right-16 text-indigo-600/70 dark:text-indigo-400/60 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${d2.x}px, ${d2.y}px, 0)` }}
      >
        <svg className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-xs" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 22c0-8 7-14 16-14s16 6 16 14-7 14-16 14c-3.2 0-6.1-.8-8.5-2.2L6 36l2.3-6.4C8.9 27.2 8 24.7 8 22z" />
          <circle cx="18" cy="22" r="2" fill="currentColor" />
          <circle cx="24" cy="22" r="2" fill="currentColor" />
          <circle cx="30" cy="22" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* DOODLE 3: Paper Airplane with dotted loop trail (middle-left) */}
      <div
        className="absolute top-1/2 -left-2 sm:left-6 text-sky-600/65 dark:text-sky-400/60 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${d3.x}px, ${d3.y}px, 0)` }}
      >
        <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 24L42 8l-14 34-6-14-14-4z" />
          <path d="M42 8L22 28" />
          <path d="M12 36c-4 4-6 2-4-2s6-4 4-7" strokeDasharray="3 3" strokeWidth="1.8" />
        </svg>
      </div>

      {/* DOODLE 4: Lightbulb Idea (middle-right) */}
      <div
        className="absolute top-1/2 right-4 sm:right-12 text-amber-500/75 dark:text-amber-400/70 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${d4.x}px, ${d4.y}px, 0)` }}
      >
        <svg className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-xs" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 32h12M20 36h8M22 40h4" />
          <path d="M15 20a9 9 0 1 1 18 0c0 4-3 7-5 9h-8c-2-2-5-5-5-9z" />
          <path d="M24 4v3M10 11l2.5 2.5M38 11l-2.5 2.5M5 22h4M39 22h4" strokeWidth="2" />
        </svg>
      </div>

      {/* DOODLE 5: Code Brackets </ > (bottom-left) */}
      <div
        className="absolute bottom-10 left-6 sm:left-14 text-emerald-600/70 dark:text-emerald-400/60 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${d5.x}px, ${d5.y}px, 0)` }}
      >
        <svg className="w-11 h-11 sm:w-13 sm:h-13 drop-shadow-xs" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16l-8 8 8 8" />
          <path d="M34 16l8 8-8 8" />
          <path d="M27 12l-6 24" strokeWidth="2.2" />
        </svg>
      </div>

      {/* DOODLE 6: Steaming Coffee Mug (bottom-right) */}
      <div
        className="absolute bottom-8 right-8 sm:right-20 text-rose-500/70 dark:text-rose-400/60 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${d6.x}px, ${d6.y}px, 0)` }}
      >
        <svg className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 16h24v15a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V16z" />
          <path d="M32 20h4a4 4 0 0 1 0 8h-4" />
          <path d="M14 6c0 2 2 3 2 5M20 6c0 2 2 3 2 5M26 6c0 2 2 3 2 5" strokeWidth="1.8" />
        </svg>
      </div>

      {/* DOODLE 7: Hand-drawn Sparkle Star (top-center) */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 text-indigo-500/60 dark:text-indigo-300/50 transition-transform duration-300 ease-out hidden md:block will-change-transform"
        style={{ transform: `translate3d(calc(-50% + ${d7.x}px), ${d7.y}px, 0)` }}
      >
        <svg className="w-8 h-8 drop-shadow-xs" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z" />
        </svg>
      </div>

      {/* DOODLE 8: Curved Swirl / Arrow Doodle (floating) */}
      <div
        className="absolute top-1/4 left-1/4 text-violet-500/40 dark:text-violet-300/40 transition-transform duration-300 ease-out hidden lg:block will-change-transform"
        style={{ transform: `translate3d(${d8.x}px, ${d8.y}px, 0)` }}
      >
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 28c4-12 18-14 24-4s-6 12-14 8c-6-3-6-10 2-14" strokeDasharray="3 3" />
          <path d="M22 18l3-2-1 3" />
        </svg>
      </div>
    </div>
  );
}
