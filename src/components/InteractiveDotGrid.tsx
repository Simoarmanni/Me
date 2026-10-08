import React, { useRef, useEffect } from "react";

interface InteractiveDotGridProps {
  dotRadius?: number;
  spacing?: number;
  maxDistance?: number;
  maxPull?: number;
  scrollProgress?: number;
}

interface Dot {
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  threshold: number;
  phase: number;
}

/** Deterministic pseudo-random number generator per dot */
function getPseudoRandom(r: number, c: number): number {
  const val = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
  return val - Math.floor(val);
}

export function InteractiveDotGrid({
  dotRadius = 1.5,
  spacing = 22,
  maxDistance = 110,
  maxPull = 6.0,
  scrollProgress = 0,
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(scrollProgress);
  const currentProgressRef = useRef<number>(scrollProgress);

  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  // Keep scrollProgressRef updated
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dots: Dot[] = [];
    let animationFrameId: number | null = null;
    let isDark = document.documentElement.classList.contains("dark");
    let isVisible = false;

    // MutationObserver to track dark mode toggle instantly
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const initDots = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;

      if (width <= 0 || height <= 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      dots = [];
      const cols = Math.floor(width / spacing) + 2;
      const rows = Math.floor(height / spacing) + 2;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * spacing;
          const y = offsetY + r * spacing;
          dots.push({
            originX: x,
            originY: y,
            currentX: x,
            currentY: y,
            targetX: x,
            targetY: y,
            threshold: getPseudoRandom(r, c),
            phase: x * 0.014 + y * 0.012,
          });
        }
      }
    };

    initDots();

    // Mouse tracking on the parent section
    const parentSection = container.closest("section") || container;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = {
        x: -9999,
        y: -9999,
        active: false,
      };
    };

    parentSection.addEventListener("mousemove", handleMouseMove as EventListener, { passive: true });
    parentSection.addEventListener("mouseleave", handleMouseLeave as EventListener, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      initDots();
    });
    resizeObserver.observe(container);

    let startTime = performance.now();

    // High performance animation loop
    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Ambient undulating wave time
      const elapsed = (currentTime - startTime) * 0.0016;

      // Smoothly interpolate scroll progress for buttery dot thinning
      currentProgressRef.current += (scrollProgressRef.current - currentProgressRef.current) * 0.12;
      const progress = Math.max(0, Math.min(1, currentProgressRef.current));

      // As you scroll (progress 0 -> 1), visible fraction drops from 100% down to ~15%
      const visibleFraction = 1 - progress * 0.85;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Subtle, softer opacities
      const baseAlpha = isDark ? 0.16 : 0.26;
      const highlightAlpha = isDark ? 0.45 : 0.48;

      const twoPi = Math.PI * 2;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Progressive thinning calculation
        const diff = visibleFraction - dot.threshold;
        let fadeMultiplier = 0;
        if (diff >= 0.08) {
          fadeMultiplier = 1;
        } else if (diff > 0) {
          fadeMultiplier = diff * 12.5; // (diff / 0.08)
        } else {
          fadeMultiplier = 0;
        }

        // If dot has dissolved, skip calculation and drawing completely
        if (fadeMultiplier <= 0.02) continue;

        // Constant gentle fluid wave sway
        const waveX = Math.cos(elapsed + dot.phase) * 1.6;
        const waveY = Math.sin(elapsed + dot.phase * 1.15) * 1.6;
        const restingX = dot.originX + waveX;
        const restingY = dot.originY + waveY;

        if (mouseActive) {
          const dx = mouseX - restingX;
          const dy = mouseY - restingY;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            // Gentle attraction towards cursor with smooth sine easing
            const normDist = dist / maxDistance;
            const factor = Math.sin((1 - normDist) * Math.PI * 0.5);
            const pull = factor * maxPull;
            const angle = Math.atan2(dy, dx);

            dot.targetX = restingX + Math.cos(angle) * pull;
            dot.targetY = restingY + Math.sin(angle) * pull;
          } else {
            dot.targetX = restingX;
            dot.targetY = restingY;
          }
        } else {
          dot.targetX = restingX;
          dot.targetY = restingY;
        }

        // Smooth lerp movement
        dot.currentX += (dot.targetX - dot.currentX) * 0.12;
        dot.currentY += (dot.targetY - dot.currentY) * 0.12;

        // Proximity highlight
        const distFromMouse = Math.hypot(mouseX - dot.currentX, mouseY - dot.currentY);
        const isNear = mouseActive && distFromMouse < maxDistance * 0.8;

        const effectiveAlpha = (isNear ? highlightAlpha : baseAlpha) * fadeMultiplier;

        if (isNear) {
          ctx.fillStyle = isDark
            ? `rgba(192, 132, 252, ${effectiveAlpha.toFixed(2)})`
            : `rgba(99, 102, 241, ${effectiveAlpha.toFixed(2)})`;
        } else {
          ctx.fillStyle = isDark
            ? `rgba(148, 163, 184, ${effectiveAlpha.toFixed(2)})`
            : `rgba(148, 163, 184, ${effectiveAlpha.toFixed(2)})`;
        }

        ctx.beginPath();
        ctx.arc(dot.currentX, dot.currentY, dotRadius, 0, twoPi);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause rendering when timeline is out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isVisible = true;
          if (animationFrameId === null) {
            startTime = performance.now();
            animationFrameId = requestAnimationFrame(render);
          }
        } else {
          isVisible = false;
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      themeObserver.disconnect();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parentSection.removeEventListener("mousemove", handleMouseMove as EventListener);
      parentSection.removeEventListener("mouseleave", handleMouseLeave as EventListener);
    };
  }, [dotRadius, spacing, maxDistance, maxPull]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
