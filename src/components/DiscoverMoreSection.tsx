import React, { useState, useEffect, useRef, MouseEvent, WheelEvent } from "react";
import { PassionItem, PoliticalViewItem, AppLanguage } from "../types";
import { 
  Sparkles, 
  Heart, 
  Scale, 
  MessageSquareQuote, 
  GitCompare, 
  ThumbsUp, 
  ThumbsDown, 
  Camera, 
  Type, 
  Check, 
  Briefcase, 
  Cpu, 
  Share2,
  Megaphone,
  ExternalLink,
  ShieldCheck,
  Eye,
  Maximize2,
  X,
  BookOpen,
  Download,
  ChevronLeft,
  ChevronRight,
  Quote,
  Languages,
  Star,
  ClipboardCheck,
  Timer,
  Video,
  HelpCircle,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiscoverMoreSectionProps {
  passions: PassionItem[];
  politicalViews: PoliticalViewItem[];
  language: AppLanguage;
}

type TabKey = "passions" | "politics" | "testimonials" | "compare" | "faq";

const toRoman = (num: number): string => {
  const lookup: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let roman = "";
  let n = Math.max(1, Math.floor(num));
  for (const [val, sym] of lookup) {
    while (n >= val) {
      roman += sym;
      n -= val;
    }
  }
  return roman || "I";
};

export function DiscoverMoreSection({
  passions,
  politicalViews,
  language
}: DiscoverMoreSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("passions");

  // Voting interaction state for political cards
  const [votes, setVotes] = useState<Record<string, "agree" | "disagree">>({});

  // Rating card state for Testimonials
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isFlashingRed, setIsFlashingRed] = useState(false);
  const [disableHoverUntilLeave, setDisableHoverUntilLeave] = useState(false);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [ratingToast, setRatingToast] = useState<string | null>(null);
  const ratingToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile touch interaction for comparisons
  const [touchActiveOtherRow, setTouchActiveOtherRow] = useState<number | null>(null);
  const [touchActiveSimoneRow, setTouchActiveSimoneRow] = useState<number | null>(null);

  // Horizontal scroll gallery ref for Photography
  const cameraGalleryRef = useRef<HTMLDivElement>(null);
  const isDraggingGalleryRef = useRef(false);
  const startXGalleryRef = useRef(0);
  const scrollLeftStartGalleryRef = useRef(0);
  const hasDraggedGalleryRef = useRef(false);

  // Horizontal scroll gallery ref for Writing (Mercante)
  const mercanteGalleryRef = useRef<HTMLDivElement>(null);
  const isDraggingMercanteRef = useRef(false);
  const startXMercanteRef = useRef(0);
  const scrollLeftStartMercanteRef = useRef(0);
  const hasDraggedMercanteRef = useRef(false);

  // Tab buttons ref for auto-scrolling active tab on mobile
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const titleHeaderRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const [isAnchored, setIsAnchored] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sentinel = sentinelRef.current;
          const nav = document.getElementById("main-navbar");
          const navHeight = nav ? nav.offsetHeight : 56;
          const section = document.getElementById("scopri-di-piu");
          const sectionRect = section?.getBoundingClientRect();

          if (sentinel) {
            const rect = sentinel.getBoundingClientRect();
            // Sentinel has reached or passed the navbar bottom
            const hasReachedTop = rect.top <= navHeight + 2;
            // And section is still currently active (not scrolled past to contatti)
            const isStillInSection = sectionRect ? sectionRect.bottom > navHeight + 80 : true;

            setIsAnchored(hasReachedTop && isStillInSection);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const el = tabButtonRefs.current[activeTab];
    const container = tabsContainerRef.current;
    if (el && container && typeof window !== "undefined" && window.innerWidth < 1024) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const currentScroll = container.scrollLeft;
      const targetScroll = currentScroll + (elRect.left - containerRect.left) - (containerRect.width / 2) + (elRect.width / 2);
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: TabKey) => {
    setActiveTab(tabId);

    // Scroll to the height of the "Scopri di più" title
    const nav = document.getElementById("main-navbar");
    const navHeight = nav ? nav.offsetHeight : 56;
    const targetElement = titleHeaderRef.current || document.getElementById("scopri-di-piu");

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const targetY = window.pageYOffset + rect.top - navHeight - 16;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth"
      });
    }
  };

  const handleGalleryMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cameraGalleryRef.current) return;
    isDraggingGalleryRef.current = true;
    hasDraggedGalleryRef.current = false;
    startXGalleryRef.current = e.pageX - cameraGalleryRef.current.offsetLeft;
    scrollLeftStartGalleryRef.current = cameraGalleryRef.current.scrollLeft;
  };

  const handleGalleryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingGalleryRef.current || !cameraGalleryRef.current) return;
    const x = e.pageX - cameraGalleryRef.current.offsetLeft;
    const walk = (x - startXGalleryRef.current) * 1.4;
    if (Math.abs(walk) > 5) {
      hasDraggedGalleryRef.current = true;
    }
    cameraGalleryRef.current.scrollLeft = scrollLeftStartGalleryRef.current - walk;
  };

  const handleGalleryMouseUpOrLeave = () => {
    isDraggingGalleryRef.current = false;
  };

  const scrollCameraGallery = (direction: "left" | "right") => {
    if (cameraGalleryRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      cameraGalleryRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMercanteMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mercanteGalleryRef.current) return;
    isDraggingMercanteRef.current = true;
    hasDraggedMercanteRef.current = false;
    startXMercanteRef.current = e.pageX - mercanteGalleryRef.current.offsetLeft;
    scrollLeftStartMercanteRef.current = mercanteGalleryRef.current.scrollLeft;
  };

  const handleMercanteMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMercanteRef.current || !mercanteGalleryRef.current) return;
    const x = e.pageX - mercanteGalleryRef.current.offsetLeft;
    const walk = (x - startXMercanteRef.current) * 1.4;
    if (Math.abs(walk) > 5) {
      hasDraggedMercanteRef.current = true;
    }
    mercanteGalleryRef.current.scrollLeft = scrollLeftStartMercanteRef.current - walk;
  };

  const handleMercanteMouseUpOrLeave = () => {
    isDraggingMercanteRef.current = false;
  };

  const scrollMercanteGallery = (direction: "left" | "right") => {
    if (mercanteGalleryRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      mercanteGalleryRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    return () => {
      if (ratingToastTimerRef.current) {
        clearTimeout(ratingToastTimerRef.current);
      }
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectRating = (stars: number) => {
    if (isFlashingRed) return;

    if (stars === 1 || stars === 2) {
      setIsFlashingRed(true);
      setSelectedRating(stars);
      setHoveredRating(null);
      setDisableHoverUntilLeave(true);
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
      flashTimeoutRef.current = setTimeout(() => {
        setIsFlashingRed(false);
        setSelectedRating(null);
        setHoveredRating(null);
      }, 850);
    } else {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
      setIsFlashingRed(false);
      setDisableHoverUntilLeave(false);
      setSelectedRating(stars);
    }

    let message = "";
    switch (stars) {
      case 1:
        message = language === "it" ? "Opinione scartata" : "Opinion discarded";
        break;
      case 2:
        message = language === "it" ? "Sarai meglio tu" : "You must be better";
        break;
      case 3:
        message = language === "it" ? "Puoi fare di meglio" : "You could do better";
        break;
      case 4:
        message = language === "it" ? "Grazie!" : "Thank you!";
        break;
      case 5:
        message = language === "it" ? "Finalmente qualcuno che ragiona!" : "Finally someone who thinks straight!";
        break;
      default:
        message = "";
    }
    setRatingToast(message);
    if (ratingToastTimerRef.current) {
      clearTimeout(ratingToastTimerRef.current);
    }
    ratingToastTimerRef.current = setTimeout(() => {
      setRatingToast(null);
    }, 4000);
  };

  // Active photo gallery for Scrittura (Mercante photos from Media/Mercante)
  const [mercantePhotos, setMercantePhotos] = useState<Array<{ src: string; title: string; desc?: string }>>([
    {
      src: "./Media/Mercante/DSC01966.jpg",
      title: "Mercante — DSC01966",
      desc: language === "it" ? "Copertina e introduzione del manoscritto" : "Cover and manuscript intro"
    },
    {
      src: "./Media/Mercante/DSC01967.jpg",
      title: "Mercante — DSC01967",
      desc: language === "it" ? "Bozze di stesura e dettagli tipografici" : "Drafting pages and typographic details"
    },
    {
      src: "./Media/Mercante/DSC01974.jpg",
      title: "Mercante — DSC01974",
      desc: language === "it" ? "Composizione visiva ed editoriale" : "Visual and editorial composition"
    }
  ]);

  // Active photo gallery for Fotografia (Camera photos from Media/Camera)
  const [cameraPhotos, setCameraPhotos] = useState<Array<{ src: string; title: string; desc?: string }>>([
    { src: "./Media/Camera/Photo-1.jpg", title: language === "it" ? "Scatto 1" : "Photo 1", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-2.jpg", title: language === "it" ? "Scatto 2" : "Photo 2", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-3.jpg", title: language === "it" ? "Scatto 3" : "Photo 3", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-4.jpg", title: language === "it" ? "Scatto 4" : "Photo 4", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-5.jpg", title: language === "it" ? "Scatto 5" : "Photo 5", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-6.jpg", title: language === "it" ? "Scatto 6" : "Photo 6", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-7.jpg", title: language === "it" ? "Scatto 7" : "Photo 7", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-8.jpg", title: language === "it" ? "Scatto 8" : "Photo 8", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-9.jpg", title: language === "it" ? "Scatto 9" : "Photo 9", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-10.jpg", title: language === "it" ? "Scatto 10" : "Photo 10", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" },
    { src: "./Media/Camera/Photo-11.jpg", title: language === "it" ? "Scatto 11" : "Photo 11", desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition" }
  ]);

  // Dynamically load all photos from the Media/Camera and Media/Mercante directories
  useEffect(() => {
    fetch("/api/media/camera")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setCameraPhotos(
            data.photos.map((p: any, idx: number) => ({
              src: p.src,
              title: language === "it" ? (p.title || `Scatto ${idx + 1}`) : (p.title || `Photo ${idx + 1}`),
              desc: language === "it" ? "Reportage, luce e composizione" : "Reportage, lighting and composition"
            }))
          );
        }
      })
      .catch(() => {});

    fetch("/api/media/mercante")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          setMercantePhotos(
            data.photos.map((p: any) => ({
              src: p.src,
              title: p.title || "Mercante",
              desc: language === "it" ? "Bozze di stesura e composizione editoriale" : "Drafting pages and editorial composition"
            }))
          );
        }
      })
      .catch(() => {});
  }, [language, activeTab]);

  // Wheel listener: allow horizontal scroll gestures to scroll the gallery,
  // while vertical scrolling scrolls the page normally without being intercepted
  useEffect(() => {
    const el = cameraGalleryRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only scroll gallery horizontally if the user is scrolling horizontally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaX;
      }
      // Vertical scroll (deltaY) is not intercepted at all, allowing natural page scrolling
    };

    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [activeTab, cameraPhotos.length]);

  useEffect(() => {
    const el = mercanteGalleryRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaX;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [activeTab, mercantePhotos.length]);

  // Animated Lightbox state supporting gallery carousel & keyboard navigation
  const [lightbox, setLightbox] = useState<{
    images: { src: string; title: string; desc?: string }[];
    index: number;
  } | null>(null);

  // Zoom and Pan state for Lightbox
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanningMouse, setIsPanningMouse] = useState(false);
  const [isTouchPanningActive, setIsTouchPanningActive] = useState(false);

  // Carousel interactive horizontal drag & vertical drag-to-dismiss state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [verticalDragOffset, setVerticalDragOffset] = useState(0);
  const [isSwipingCarousel, setIsSwipingCarousel] = useState(false);
  const [isDraggingToDismiss, setIsDraggingToDismiss] = useState(false);
  const [isSnapAnimating, setIsSnapAnimating] = useState(false);

  // Refs for tracking values inside native event listeners
  const zoomScaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const imageViewportRef = useRef<HTMLDivElement>(null);
  const mouseDragStartRef = useRef<{ x: number; y: number } | null>(null);

  const swipeOffsetRef = useRef(0);
  const verticalDragOffsetRef = useRef(0);
  const dragDirectionRef = useRef<"horizontal" | "vertical" | null>(null);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    zoomScaleRef.current = zoomScale;
  }, [zoomScale]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    swipeOffsetRef.current = swipeOffset;
  }, [swipeOffset]);

  useEffect(() => {
    verticalDragOffsetRef.current = verticalDragOffset;
  }, [verticalDragOffset]);

  // Reset zoom & pan when opening/closing or changing images
  const resetZoom = () => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
    zoomScaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setSwipeOffset(0);
    setVerticalDragOffset(0);
    swipeOffsetRef.current = 0;
    verticalDragOffsetRef.current = 0;
    dragDirectionRef.current = null;
    setIsSwipingCarousel(false);
    setIsDraggingToDismiss(false);
    setIsSnapAnimating(false);
    setIsTouchPanningActive(false);
  };

  useEffect(() => {
    resetZoom();
  }, [lightbox?.index]);

  const clampPan = (targetPan: { x: number; y: number }, scale: number) => {
    if (scale <= 1.05) return { x: 0, y: 0 };
    const maxPanX = Math.max(0, (window.innerWidth * (scale - 1)) / 1.6);
    const maxPanY = Math.max(0, (window.innerHeight * (scale - 1)) / 1.6);
    return {
      x: Math.min(maxPanX, Math.max(-maxPanX, targetPan.x)),
      y: Math.min(maxPanY, Math.max(-maxPanY, targetPan.y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsPanningMouse(true);
    mouseDragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanningMouse || !mouseDragStartRef.current || zoomScale <= 1) return;
    const newPan = clampPan(
      {
        x: e.clientX - mouseDragStartRef.current.x,
        y: e.clientY - mouseDragStartRef.current.y,
      },
      zoomScale
    );
    setPan(newPan);
  };

  const handleMouseUp = () => {
    setIsPanningMouse(false);
    mouseDragStartRef.current = null;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomScale > 1.05) {
      resetZoom();
    } else {
      const targetScale = 2.5;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const relX = e.clientX - centerX;
      const relY = e.clientY - centerY;
      const targetPan = clampPan(
        {
          x: -relX * (targetScale - 1),
          y: -relY * (targetScale - 1),
        },
        targetScale
      );
      setZoomScale(targetScale);
      setPan(targetPan);
      zoomScaleRef.current = targetScale;
      panRef.current = targetPan;
    }
  };

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") {
        resetZoom();
        setLightbox((prev) => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
      }
      if (e.key === "ArrowRight") {
        resetZoom();
        setLightbox((prev) => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const handlePrevImage = (e?: React.MouseEvent | MouseEvent) => {
    e?.stopPropagation();
    resetZoom();
    setLightbox((prev) => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
  };

  const handleNextImage = (e?: React.MouseEvent | MouseEvent) => {
    e?.stopPropagation();
    resetZoom();
    setLightbox((prev) => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
  };

  // Trackpad pinch-to-zoom & mobile pinch/pan touch listeners
  useEffect(() => {
    if (!lightbox) return;
    const viewport = imageViewportRef.current;
    if (!viewport) return;

    // 1. Trackpad Pinch-to-zoom (wheel with ctrlKey on Mac/Windows trackpad)
    const handleWheel = (e: globalThis.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = -e.deltaY * 0.015;
        const currentScale = zoomScaleRef.current;
        const nextScale = Math.min(4, Math.max(1, currentScale + zoomDelta));
        setZoomScale(nextScale);
        if (nextScale <= 1.05) {
          setPan({ x: 0, y: 0 });
        }
      } else if (zoomScaleRef.current > 1) {
        e.preventDefault();
        setPan((prev) =>
          clampPan(
            {
              x: prev.x - e.deltaX * 1.2,
              y: prev.y - e.deltaY * 1.2,
            },
            zoomScaleRef.current
          )
        );
      }
    };

    // 2. Mobile Touch: 2-finger pinch-to-zoom, 1-finger pan (when zoomed), or horizontal swipe (when 1x)
    let initialPinchDistance = 0;
    let initialPinchScale = 1;
    let isPinching = false;
    let isTouchPanning = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let panStartX = 0;
    let panStartY = 0;
    let lastTapTime = 0;

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      touchStartTimeRef.current = Date.now();

      if (e.touches.length === 2) {
        // Multi-touch: Pinch to zoom
        isPinching = true;
        isTouchPanning = false;
        setIsTouchPanningActive(false);
        dragDirectionRef.current = null;
        setIsSwipingCarousel(false);
        setIsDraggingToDismiss(false);
        setSwipeOffset(0);
        setVerticalDragOffset(0);
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchScale = zoomScaleRef.current;
      } else if (e.touches.length === 1) {
        isPinching = false;
        dragDirectionRef.current = null;

        const now = Date.now();
        const tapX = e.touches[0].clientX;
        const tapY = e.touches[0].clientY;

        // Double tap gesture: zoom directly where tapped!
        if (now - lastTapTime < 320) {
          e.preventDefault();
          if (zoomScaleRef.current > 1.05) {
            // Already zoomed in: reset back to 1x and center
            setZoomScale(1);
            setPan({ x: 0, y: 0 });
            zoomScaleRef.current = 1;
            panRef.current = { x: 0, y: 0 };
            setIsTouchPanningActive(false);
          } else {
            // Zoom in to 2.5x centered on the tapped location
            const targetScale = 2.5;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const relX = tapX - centerX;
            const relY = tapY - centerY;
            const targetPan = clampPan(
              {
                x: -relX * (targetScale - 1),
                y: -relY * (targetScale - 1),
              },
              targetScale
            );
            setZoomScale(targetScale);
            setPan(targetPan);
            zoomScaleRef.current = targetScale;
            panRef.current = targetPan;
            setIsTouchPanningActive(false);
          }
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        panStartX = panRef.current.x;
        panStartY = panRef.current.y;

        if (zoomScaleRef.current > 1.05) {
          isTouchPanning = true;
          dragDirectionRef.current = null;
          setIsSwipingCarousel(false);
          setIsDraggingToDismiss(false);
          setSwipeOffset(0);
          setVerticalDragOffset(0);
        } else {
          isTouchPanning = false;
          dragDirectionRef.current = null;
          setIsSnapAnimating(false);
        }
      }
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (initialPinchDistance > 0) {
          const ratio = dist / initialPinchDistance;
          const targetScale = Math.min(4, Math.max(1, initialPinchScale * ratio));
          setZoomScale(targetScale);
          zoomScaleRef.current = targetScale;
          if (targetScale <= 1.05) {
            setPan({ x: 0, y: 0 });
            panRef.current = { x: 0, y: 0 };
          }
        }
      } else if (e.touches.length === 1 && zoomScaleRef.current > 1.05) {
        // When zoomed in: exclusively pan the photo around, NO carousel swiping and NO dismissal!
        e.preventDefault();
        setIsTouchPanningActive(true);
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        const newPan = clampPan(
          {
            x: panStartX + dx,
            y: panStartY + dy,
          },
          zoomScaleRef.current
        );
        setPan(newPan);
        panRef.current = newPan;
        return;
      } else if (e.touches.length === 1 && zoomScaleRef.current <= 1.05) {
        // Only allow carousel switching or vertical drag-to-dismiss when scale is 1x (not zoomed)!
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;

        if (!dragDirectionRef.current) {
          if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
            if (Math.abs(dx) > Math.abs(dy)) {
              dragDirectionRef.current = "horizontal";
              setIsSwipingCarousel(true);
              setIsDraggingToDismiss(false);
            } else {
              dragDirectionRef.current = "vertical";
              setIsDraggingToDismiss(true);
              setIsSwipingCarousel(false);
            }
          }
        }

        if (dragDirectionRef.current === "horizontal") {
          e.preventDefault();
          // Real-time carousel follow-finger motion
          setSwipeOffset(dx);
        } else if (dragDirectionRef.current === "vertical") {
          e.preventDefault();
          // Real-time vertical drag-to-dismiss (only photo moves)
          setVerticalDragOffset(dy);
        }
      }
    };

    const handleTouchEnd = (e: globalThis.TouchEvent) => {
      setIsTouchPanningActive(false);
      if (isPinching && e.touches.length < 2) {
        isPinching = false;
        // Snap back to 1x if scale is near 1
        if (zoomScaleRef.current <= 1.15) {
          setZoomScale(1);
          setPan({ x: 0, y: 0 });
          zoomScaleRef.current = 1;
          panRef.current = { x: 0, y: 0 };
        }
      }
      if (isTouchPanning && e.touches.length === 0) {
        isTouchPanning = false;
      }

      if (dragDirectionRef.current === "horizontal") {
        const offset = swipeOffsetRef.current;
        const trackWidth = trackRef.current?.clientWidth || window.innerWidth;
        const gap = 24;
        const step = trackWidth + gap;
        const elapsed = Math.max(1, Date.now() - touchStartTimeRef.current);
        const velocity = offset / elapsed; // px per ms (negative when swiping left)

        setIsSwipingCarousel(false);

        // "serve meno movimento per passare da una all'altra"
        // Easy flick: velocity > 0.18 px/ms and distance > 12px, OR distance > 28px
        const isFlick = Math.abs(velocity) > 0.18 && Math.abs(offset) > 12;
        const shouldGoNext = (offset < -28 || (isFlick && velocity < 0)) && lightbox.images.length > 1;
        const shouldGoPrev = (offset > 28 || (isFlick && velocity > 0)) && lightbox.images.length > 1;

        if (animTimerRef.current) clearTimeout(animTimerRef.current);

        if (shouldGoNext) {
          // Animate glide continuously to next image with zero recoil!
          setIsSnapAnimating(true);
          setSwipeOffset(-step);

          animTimerRef.current = setTimeout(() => {
            setLightbox((prev) =>
              prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
            );
            setIsSnapAnimating(false);
            setSwipeOffset(0);
            swipeOffsetRef.current = 0;
            resetZoom();
          }, 280);
        } else if (shouldGoPrev) {
          // Animate glide continuously to previous image with zero recoil!
          setIsSnapAnimating(true);
          setSwipeOffset(step);

          animTimerRef.current = setTimeout(() => {
            setLightbox((prev) =>
              prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null
            );
            setIsSnapAnimating(false);
            setSwipeOffset(0);
            swipeOffsetRef.current = 0;
            resetZoom();
          }, 280);
        } else {
          // Glides smoothly back to center
          setIsSnapAnimating(true);
          setSwipeOffset(0);
          animTimerRef.current = setTimeout(() => {
            setIsSnapAnimating(false);
          }, 240);
        }
      } else if (dragDirectionRef.current === "vertical") {
        const vOffset = verticalDragOffsetRef.current;
        const elapsed = Math.max(1, Date.now() - touchStartTimeRef.current);
        const velocityY = vOffset / elapsed;
        setIsDraggingToDismiss(false);

        const shouldDismiss = Math.abs(vOffset) > 60 || (Math.abs(velocityY) > 0.35 && Math.abs(vOffset) > 20);

        if (shouldDismiss) {
          setIsSnapAnimating(true);
          setVerticalDragOffset(vOffset > 0 ? window.innerHeight * 0.75 : -window.innerHeight * 0.75);
          setTimeout(() => {
            setLightbox(null);
            setVerticalDragOffset(0);
            setIsSnapAnimating(false);
          }, 200);
        } else {
          setIsSnapAnimating(true);
          setVerticalDragOffset(0);
          setTimeout(() => {
            setIsSnapAnimating(false);
          }, 240);
        }
      }

      dragDirectionRef.current = null;
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    viewport.addEventListener("touchstart", handleTouchStart, { passive: false });
    viewport.addEventListener("touchmove", handleTouchMove, { passive: false });
    viewport.addEventListener("touchend", handleTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      viewport.removeEventListener("touchstart", handleTouchStart);
      viewport.removeEventListener("touchmove", handleTouchMove);
      viewport.removeEventListener("touchend", handleTouchEnd);
      viewport.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [lightbox]);

  // Listener for global keyboard shortcut tab switching & lightbox close
  useEffect(() => {
    const handleCustomTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: TabKey }>;
      if (customEvent.detail?.tab) {
        setLightbox(null);
        handleTabClick(customEvent.detail.tab);
      }
    };
    const handleCloseLightbox = () => {
      setLightbox(null);
    };

    window.addEventListener("simone_select_tab", handleCustomTab);
    window.addEventListener("simone_close_lightbox", handleCloseLightbox);

    return () => {
      window.removeEventListener("simone_select_tab", handleCustomTab);
      window.removeEventListener("simone_close_lightbox", handleCloseLightbox);
    };
  }, []);

  // Load votes from localStorage
  useEffect(() => {
    try {
      const savedVotes = localStorage.getItem("simone_political_votes");
      if (savedVotes) {
        setVotes(JSON.parse(savedVotes));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleVote = (viewId: string, type: "agree" | "disagree") => {
    setVotes((prev) => {
      const newVotes = { ...prev };
      if (newVotes[viewId] === type) {
        delete newVotes[viewId];
      } else {
        newVotes[viewId] = type;
      }
      localStorage.setItem("simone_political_votes", JSON.stringify(newVotes));
      return newVotes;
    });
  };

  const tabsConfig = [
    {
      id: "passions" as TabKey,
      label: language === "it" ? "Passioni" : "Passions",
      subtitle: language === "it" ? "Nel tempo libero" : "In my free time",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bgActive: "bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-500 shadow-xs",
      hoverBorderClass: "hover:border-rose-400 dark:hover:border-rose-500",
      badgeColor: "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
    },
    {
      id: "politics" as TabKey,
      label: language === "it" ? "Opinioni politiche" : "Political views",
      subtitle: language === "it" ? "Valori e visione lavorativa" : "Workplace and welfare values",
      icon: Scale,
      color: "text-indigo-600 dark:text-indigo-400",
      bgActive: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-500 shadow-xs",
      hoverBorderClass: "hover:border-indigo-400 dark:hover:border-indigo-500",
      badgeColor: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
    },
    {
      id: "testimonials" as TabKey,
      label: language === "it" ? "Dicono di me" : "What they say",
      subtitle: language === "it" ? "Testimonianze anonime" : "Anonymous feedback",
      icon: MessageSquareQuote,
      color: "text-amber-600 dark:text-amber-400",
      bgActive: "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-500 shadow-xs",
      hoverBorderClass: "hover:border-amber-400 dark:hover:border-amber-500",
      badgeColor: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
    },
    {
      id: "compare" as TabKey,
      label: language === "it" ? "Confronta" : "Compare",
      subtitle: language === "it" ? "Confronto cogli altri candidati." : "Comparison with other candidates.",
      icon: GitCompare,
      color: "text-emerald-600 dark:text-emerald-400",
      bgActive: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500 shadow-xs",
      hoverBorderClass: "hover:border-emerald-400 dark:hover:border-emerald-500",
      badgeColor: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
    },
    {
      id: "faq" as TabKey,
      label: "FAQ",
      subtitle: language === "it" ? "Domande frequenti" : "Frequently asked questions",
      icon: HelpCircle,
      color: "text-black dark:text-white",
      bgActive: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-400 dark:border-slate-400 shadow-xs",
      hoverBorderClass: "hover:border-slate-700 dark:hover:border-slate-400",
      badgeColor: "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
    }
  ];

  const renderTabButton = (tab: (typeof tabsConfig)[0], isMobile: boolean) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <button
        key={tab.id}
        ref={(el) => {
          if (isMobile) {
            tabButtonRefs.current[tab.id] = el;
          }
        }}
        id={isMobile ? `tab-btn-m-${tab.id}` : `tab-btn-${tab.id}`}
        onClick={() => handleTabClick(tab.id)}
        className={`shrink-0 lg:w-full text-left ${
          isMobile ? "px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl" : "p-4 rounded-2xl"
        } border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 sm:gap-3 group touch-manipulation ${
          isActive
            ? `${tab.bgActive} ${tab.hoverBorderClass}`
            : `bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white shadow-2xs ${tab.hoverBorderClass}`
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className={`p-1.5 sm:p-2 lg:p-2.5 rounded-lg lg:rounded-xl border transition-colors shrink-0 ${
              isActive
                ? "bg-white dark:bg-slate-900 border-white/60 dark:border-slate-700 shadow-xs"
                : "bg-slate-50 dark:bg-slate-700 border-slate-200/60 dark:border-slate-600 group-hover:bg-white dark:group-hover:bg-slate-600"
            }`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${tab.color}`} />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm lg:text-base tracking-tight leading-snug whitespace-nowrap">
              {tab.label}
            </div>
          </div>
        </div>

        <div className={isMobile ? "hidden" : "hidden lg:flex items-center"}>
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              isActive ? "bg-current scale-125" : "bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-slate-500"
            }`}
          />
        </div>
      </button>
    );
  };

  // Uniform user icon for all testimonials as requested
  const personIcon = (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  // Testimonials: 1st is the magazine one, 2nd is the worst employee, 3rd is the ambassador, 4th is the new 4-star parcel delivery
  const testimonialsData = [
    {
      quote: language === "it"
        ? "All'inizio non capivo come mai avesse sempre Word aperto, ma quando poi ho scoperto che ha scritto tutta una rivista durante l'orario di lavoro sono rimasta davvero colpita dalla sua intraprendenza e voglia di fare, lo ammiro molto."
        : "At first I didn't understand why he always had Word open, but when I later found out he wrote an entire magazine during work hours, I was genuinely impressed by his resourcefulness and initiative, I admire him very much.",
      author: language === "it" ? "Anonimo" : "Anonymous",
      bg: "from-emerald-500 to-teal-600",
      stars: 5
    },
    {
      quote: language === "it"
        ? "Decisamente il peggior dipendente che abbia mai avuto, ho quasi rischiato di perdere il posto per colpa sua perché il mio manager ha notato che faceva le stesse cose che facevo io in metà del tempo. Godo che gli è scaduto il contratto."
        : "Definitely the worst employee I've ever had; I almost risked losing my job because my manager noticed he did the exact same things as me in half the time. So glad his contract expired.",
      author: language === "it" ? "Anonimo" : "Anonymous",
      bg: "from-blue-500 to-indigo-600",
      stars: 1
    },
    {
      quote: language === "it"
        ? "Lavorare con Simone è un'esperienza piacevole e consigliata! A parte l'incidente diplomatico con l'ambasciatore del Nicaragua non ho mai avuto problemi con lui."
        : "Working with Simone is an enjoyable and highly recommended experience! Aside from that diplomatic incident with the ambassador of Nicaragua, I've never had any issues with him.",
      author: language === "it" ? "Anonimo" : "Anonymous",
      bg: "from-indigo-500 to-violet-600",
      stars: 4
    },
    {
      quote: language === "it"
        ? "Arrivato tutto puntuale. Fate attenzione però perché il colore è un po' più chiaro di quello in foto."
        : "Everything arrived on time. Be careful though because the color is a bit lighter than in the picture.",
      author: language === "it" ? "Anonimo" : "Anonymous",
      bg: "from-sky-500 to-blue-600",
      stars: 4
    }
  ];

  // Specific ironic comparison points requested by user:
  // Penultimate is "Scala 40" where Simone doesn't know and standard knows
  const compareRows = [
    {
      trait: language === "it" ? "Orario di uscita e Puntualità" : "End-of-day Punctuality",
      simone: language === "it" 
        ? "Finisce puntuale alle 18:00, a volte anche 18:01" 
        : "Finishes punctually at 18:00, sometimes even 18:01",
      standard: language === "it" 
        ? "Stacca alle 17:59" 
        : "Clocks out at 17:59",
      simoneWins: true
    },
    {
      trait: language === "it" ? "Gestione della responsabilità" : "Accountability and Ownership",
      simone: language === "it" 
        ? "Si prende le colpe al posto vostro, basta che si vada in pausa puntuali" 
        : "Takes the blame for everyone, as long as break starts on time",
      standard: language === "it" 
        ? "Non si prende le proprie responsabilità, tantomeno quelle altrui" 
        : "Takes no responsibility for himself, let alone for others",
      simoneWins: true
    },
    {
      trait: language === "it" ? "Passione e Lucidità Critica" : "Passion and Critical Clarity",
      simone: language === "it" 
        ? "Si finge interessato anche quando non lo è per rimanere lucido e autocritico" 
        : "Pretends to be interested even when he is not, to stay sharp and critical",
      standard: language === "it" 
        ? "Realmente coinvolto ed appassionato, compromettendo la propria capacità critica" 
        : "Truly involved and passionate, compromising his own critical ability",
      simoneWins: true
    },
    {
      trait: language === "it" ? "Presenza e Malattia" : "Attendance and Sick Leave",
      simone: language === "it" 
        ? "Si finge malato solo due o tre volte l'anno" 
        : "Fakes being sick only two or three times a year",
      standard: language === "it" 
        ? "Pur di non darsi malato passa l'influenza a tutti i colleghi" 
        : "Rather than taking sick leave, passes the flu to all coworkers",
      simoneWins: true
    },
    {
      trait: language === "it" ? "Uso del tempo e Social" : "Time Spent and Social Networks",
      simone: language === "it" 
        ? "Ha perso tempo a fare questo sito web nei minimi dettagli" 
        : "Spent valuable time crafting this entire website down to every detail",
      standard: language === "it" 
        ? "Perde tempo su LinkedIn con post motivazionali ed auto-celebrazioni" 
        : "Wastes time on LinkedIn with motivational posts and self-praise",
      simoneWins: true
    },
    {
      trait: language === "it" ? "Giochi di carte" : "Card games",
      simone: language === "it"
        ? "Non sa giocare a Scala 40 nonostante gli sia stato spiegato in tre occasioni diverse"
        : "Doesn't know how to play Scala 40 even though it was explained to him on three separate occasions",
      standard: language === "it"
        ? "Campione indiscusso del torneo aziendale di Scala 40"
        : "Undisputed champion of the corporate Scala 40 tournament",
      simoneWins: false
    },
    {
      trait: language === "it" ? "Risorse Umane" : "Human Resources",
      simone: language === "it" 
        ? "Ama le risorse umane con tutto il cuore" 
        : "Loves human resources with all his heart",
      standard: language === "it" 
        ? "Le considera un fastidioso ostacolo burocratico da evitare" 
        : "Considers them an annoying bureaucratic obstacle to avoid",
      simoneWins: true
    }
  ];

  const getTopicIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 1:
        return <Cpu className="w-4 h-4 text-violet-600" />;
      case 2:
        return <Share2 className="w-4 h-4 text-sky-600" />;
      case 3:
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 4:
        return <Languages className="w-4 h-4 text-indigo-600" />;
      default:
        return <Scale className="w-4 h-4 text-slate-600" />;
    }
  };

  const renderStanceContent = (text: string) => {
    if (!text.includes("*")) {
      return text;
    }
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={pIdx} className="italic font-medium text-indigo-700 dark:text-indigo-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const faqData = [
    {
      q: language === "it"
        ? "Perché questo sito?"
        : "Why this website?",
      a: language === "it"
        ? "Diciamocelo chiaramente, so bene che ora come ora il mio curriculum non è nulla di speciale, ma ho volutamente evitato qualsivoglia guizzo di creatività perché dormo col timore che un algoritmo possa scartarmi a priori perché troppo stupido per interpretare un briciolo di originalità. Questo sito invece è pensato per essere letto esclusivamente da persone in carne e ossa, che per definizione non possono essere stupide."
        : "Let's be frank: I know well that as things stand, my CV is nothing extraordinary, but I deliberately avoided any glimmer of creativity because I live in fear that an algorithm might reject me offhand for being too stupid to interpret a shred of originality. This website, on the other hand, is meant to be read exclusively by flesh-and-blood human beings, who by definition cannot be stupid."
    },
    {
      q: language === "it"
        ? "Credi davvero che qualcuno si prenderà la briga di leggere tutto quanto?"
        : "Do you really believe someone will bother to read everything?",
      a: language === "it" ? "No" : "No"
    },
    {
      q: language === "it"
        ? "Lo sai che le FAQ non sono un'intervista?"
        : "You know that a FAQ isn't an interview, right?",
      a: language === "it"
        ? "Lo so, ma il sito è mio e faccio come voglio io"
        : "I know, but it's my website and I do whatever I want"
    },
    {
      q: language === "it"
        ? "Se potessi risolvere un problema globale oggi stesso, quale sarebbe?"
        : "If you could solve one global issue right now, what would it be?",
      a: language === "it"
        ? "La fame nel mondo"
        : "World hunger"
    },
    {
      q: language === "it"
        ? "Cosa significa per te essere una donna forte e indipendente nella società odierna?"
        : "What does being a strong, independent woman in today's society mean to you?",
      a: language === "it"
        ? "Non lo so, non sono donna"
        : "I don't know, I'm not a woman"
    }
  ];

  return (
    <section id="scopri-di-piu" className="py-6 sm:py-8 md:py-10 bg-slate-50/90 dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 transition-colors scroll-mt-20 md:scroll-mt-24 w-full">
      {/* Section Header: Icon on left, no label above, tight margin to buttons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleHeaderRef} className="mb-2 sm:mb-2.5 pb-2 sm:pb-2.5 border-b border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 scroll-mt-20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100/80 dark:border-violet-800/60 text-violet-600 dark:text-violet-400 inline-flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <span>{language === "it" ? "Scopri di più" : "Discover more"}</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {language === "it"
                ? "Passioni, valori, e altre informazioni personali"
                : "Passions, values, and other personal insights"}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Full-Width Sticky Navigation Bar: Background appears only when anchored */}
      <div ref={sentinelRef} className="lg:hidden h-px w-full pointer-events-none" />
      <div
        ref={stickyBarRef}
        className={`lg:hidden sticky top-14 z-30 w-full transition-all duration-200 ${
          isAnchored
            ? "bg-slate-50/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs pt-4 pb-2 sm:pt-4.5 sm:pb-2.5"
            : "bg-transparent border-b border-transparent shadow-none py-1 sm:py-1.5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div 
            ref={tabsContainerRef}
            className="flex flex-row gap-2 sm:gap-2.5 overflow-x-auto pb-1 sm:pb-1.5 scrollbar-none w-full min-w-0 max-w-full touch-pan-x" 
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {tabsConfig.map((tab) => renderTabButton(tab, true))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-3 sm:mt-4 lg:mt-3">
        <div className="grid lg:grid-cols-12 gap-6 items-start relative w-full min-w-0 max-w-full">
          {/* Desktop Left Column: Sticky Buttons (Hidden on mobile) */}
          <div className={`hidden lg:block lg:col-span-4 sticky z-20 self-start w-full transition-all duration-200 ${isAnchored ? "lg:top-24" : "lg:top-20"}`}>
            <div className="flex flex-col gap-2.5">
              {tabsConfig.map((tab) => renderTabButton(tab, false))}
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic Content */}
          <div className="lg:col-span-8 min-h-[440px] w-full min-w-0">
            {/* 1. PASSIONS TAB: Only Fotografia & Scrittura, redesigned to showcase images */}
            {activeTab === "passions" && (
              <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0">
                {/* Passion 1: Scrittura (Writing) with Mercante photos gallery */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500 transition-all w-full min-w-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
                        <Type className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {language === "it" ? "Scrittura" : "Writing"}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {language === "it"
                      ? "Mi piace scrivere e, modestia a parte, mi riesce pure bene. Scrivo per lo più riflessioni, brevi saggi, e storie umoristiche. Il mio lavoro più impegnativo è stato fino a ora \"Il Mercante\", una rivista satirica di una cinquantina di pagine che ho ideato, scritto, illustrato, impaginato, e persino stampato per il solo gusto di scrivere."
                      : "I enjoy writing and, modesty aside, I'm quite good at it. I mostly write reflections, short essays, and humorous stories. My most demanding work so far is \"Il Mercante\", a satirical magazine of about fifty pages that I created, wrote, illustrated, formatted, and even printed purely for the love of writing."}
                  </p>

                  {/* Mercante Image Showcase Gallery */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 w-full min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{language === "it" ? "La mia rivista" : "My magazine"}</span>
                      </span>
                      {mercantePhotos.length > 0 && (
                        <div className="flex sm:hidden items-center gap-1">
                          <button
                            type="button"
                            onClick={() => scrollMercanteGallery("left")}
                            className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
                            aria-label="Scorri indietro"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollMercanteGallery("right")}
                            className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
                            aria-label="Scorri avanti"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400">
                        {mercantePhotos.length} {language === "it" ? "foto" : (mercantePhotos.length === 1 ? "photo" : "photos")}
                      </span>
                    </div>

                    {/* Image Gallery: Responsive - matching Fotografia horizontal scroll gallery on mobile, grid on desktop */}
                    {mercantePhotos.length > 0 ? (
                      <div
                        ref={mercanteGalleryRef}
                        onMouseDown={handleMercanteMouseDown}
                        onMouseMove={handleMercanteMouseMove}
                        onMouseUp={handleMercanteMouseUpOrLeave}
                        onMouseLeave={handleMercanteMouseUpOrLeave}
                        className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 select-none w-full min-w-0 max-w-full cursor-grab active:cursor-grabbing sm:cursor-default scrollbar-thin"
                        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
                      >
                        {mercantePhotos.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => {
                              if (!hasDraggedMercanteRef.current) {
                                setLightbox({ images: mercantePhotos, index: pIdx });
                              }
                            }}
                            className="group relative shrink-0 w-52 sm:w-auto aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-400 bg-slate-900 transition-all cursor-pointer shadow-2xs hover:shadow-md"
                            title={`Scatto ${toRoman(pIdx + 1)}`}
                          >
                            <img
                              src={photo.src}
                              alt={`Scatto ${toRoman(pIdx + 1)}`}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />

                            {/* Roman numeral counter in bottom left */}
                            <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-[11px] font-mono font-semibold tracking-wider border border-white/10 shadow-sm pointer-events-none">
                              {toRoman(pIdx + 1)}
                            </span>

                            <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 group-hover:bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-xs pointer-events-none">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-7 px-4 text-center rounded-xl bg-white/70 dark:bg-slate-800/70 border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        <Type className="w-5 h-5 mx-auto mb-1.5 text-slate-400" />
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {language === "it"
                            ? "Nessuna foto trovata in Media/Mercante"
                            : "No photos found in Media/Mercante"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {language === "it"
                            ? "Le immagini caricate nella cartella Media/Mercante appariranno automaticamente qui."
                            : "Images placed in the Media/Mercante folder will automatically appear here."}
                        </p>
                      </div>
                    )}

                    {/* Download Magazine Button */}
                    <div className="pt-2">
                      <a
                        href="./Media/Il mercante.pdf"
                        download="Il mercante.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === "it" ? "Scarica la rivista 'Il mercante' (PDF)" : "Download 'Il mercante' magazine (PDF)"}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Passion 2: Fotografia (Photography) */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-500 transition-all w-full min-w-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-2xs">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {language === "it" ? "Fotografia" : "Photography"}
                        </h3>
                      </div>
                    </div>

                    <a
                      href="https://www.flickr.com/people/simoarmanni/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === "it" ? "Galleria su Flickr" : "Flickr Gallery"}</span>
                    </a>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {language === "it"
                      ? "La passione per la fotografia è relativamente recente, e per essa ho dovuto imparare da zero un modo nuovo di raccontare le cose, fatto di luci, ombre, contrasti, colori, e molta pazienza. Non sono ancora un professionista, ma la fotografia mi ha già dato grandissime soddisfazioni."
                      : "My passion for photography is relatively recent, and for it I had to learn from scratch a new way of telling stories, made of lights, shadows, contrasts, colors, and a lot of patience. I'm not a professional yet, but photography has already given me great fulfillment."}
                  </p>

                  {/* Camera Image Showcase Gallery */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 w-full min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>{language === "it" ? "Galleria fotografica" : "Photo gallery"}</span>
                      </span>
                      {cameraPhotos.length > 0 && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => scrollCameraGallery("left")}
                            className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
                            aria-label="Scorri indietro"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollCameraGallery("right")}
                            className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs"
                            aria-label="Scorri avanti"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Horizontal scroll gallery: smooth mouse wheel interception and mouse drag */}
                    {cameraPhotos.length > 0 ? (
                      <div
                        ref={cameraGalleryRef}
                        onMouseDown={handleGalleryMouseDown}
                        onMouseMove={handleGalleryMouseMove}
                        onMouseUp={handleGalleryMouseUpOrLeave}
                        onMouseLeave={handleGalleryMouseUpOrLeave}
                        className="flex gap-3 overflow-x-auto pb-2 select-none w-full min-w-0 max-w-full cursor-grab active:cursor-grabbing scrollbar-thin"
                        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
                      >
                        {cameraPhotos.map((photo, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => {
                              if (!hasDraggedGalleryRef.current) {
                                setLightbox({ images: cameraPhotos, index: cIdx });
                              }
                            }}
                            className="group relative shrink-0 w-52 sm:w-60 aspect-4/3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-400 bg-slate-900 transition-all cursor-pointer shadow-2xs hover:shadow-md"
                            title={`Scatto ${toRoman(cIdx + 1)}`}
                          >
                            <img
                              src={photo.src}
                              alt={`Scatto ${toRoman(cIdx + 1)}`}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />

                            {/* Roman numeral counter in bottom left */}
                            <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-[11px] font-mono font-semibold tracking-wider border border-white/10 shadow-sm pointer-events-none">
                              {toRoman(cIdx + 1)}
                            </span>

                            <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 group-hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-xs pointer-events-none">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-7 px-4 text-center rounded-xl bg-white/70 dark:bg-slate-800/70 border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        <Camera className="w-5 h-5 mx-auto mb-1.5 text-slate-400" />
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {language === "it"
                            ? "Nessuna foto trovata in Media/Camera"
                            : "No photos found in Media/Camera"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {language === "it"
                            ? "Le foto caricate nella cartella Media/Camera appariranno automaticamente qui."
                            : "Photos placed in the Media/Camera folder will automatically appear here."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passion 3: Video e cortometraggi */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-violet-300 dark:hover:border-violet-500 transition-all w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-800/60 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-2xs">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {language === "it" ? "Video e cortometraggi" : "Videos and short films"}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {language === "it"
                      ? "Ammetto che è la passione che porto avanti con minore frequenza, ma d'altronde è quella che richiede più tempo e spesso anche più mezzi. Purtroppo non posso condividere molti dei video che ho realizzato perché mi precluderei immediatamente qualsiasi assunzione, ma uno sì dai."
                      : "I admit it's the passion I pursue least frequently, but then again it's the one that requires the most time and often the most resources. Unfortunately I can't share many of the videos I've made because it would instantly rule out any hiring prospects, but here's one at least."}
                  </p>

                  {/* YouTube Embed: directly playable and viewable on-site without leaving the page */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-900 overflow-hidden shadow-xs">
                    <div className="relative w-full aspect-video">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/uPNvfgbqVkM"
                        title={language === "it" ? "Video e cortometraggi" : "Videos and short films"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Passion 4: Test attitudinali */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-500 transition-all w-full min-w-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
                        <ClipboardCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {language === "it" ? "Test attitudinali" : "Aptitude Tests"}
                        </h3>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/80 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Record: 52m 36s</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === "it"
                      ? "Non riesco ad averne mai abbastanza! A volte mi candido a delle offerte di lavoro solo per il piacere di fare un buon test attitudinale, e ad ogni test cerco di battere il mio miglior tempo di compilazione. In linea di massima le domande si somigliano un po' tutte, per cui di solito procedo spedito, ma amo quando la sfida si fa dura con domande scomode e personali che richiedono una grande capacità introspettiva, e mi vedo costretto a fermarmi per qualche minuto a riflettere. Mi fa sentire come se qualcuno davvero leggesse le mie risposte."
                      : "I can never get enough of them! Sometimes I apply for job openings just for the pure joy of taking a good aptitude test, and with each test I try to beat my personal speed record. For the most part, the questions are all pretty similar so I usually breeze right through, but I love when the challenge gets tough with uncomfortable, personal questions that demand deep introspection, and I'm forced to pause for a few minutes to think. It makes me feel like someone is actually reading my answers."}
                  </p>
                </div>
              </div>
            )}

            {/* 3. POLITICAL VIEWS TAB: Topic labels transformed to titles with icons, no arrows */}
            {activeTab === "politics" && (
              <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
                {politicalViews.map((view, idx) => {
                  const userVote = votes[view.id];
                  return (
                    <div
                      key={view.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
                    >
                      <div>
                        {/* Topic rendered as prominent title with icon */}
                        <div className="flex items-center gap-2.5 mb-3.5">
                          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                            {getTopicIcon(idx)}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {view.topic}
                          </h3>
                        </div>

                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-serif first-letter:font-bold first-letter:mr-3.5 first-letter:mt-1 first-letter:text-indigo-600 select-text">
                          {renderStanceContent(view.stance)}
                        </p>
                      </div>

                      {/* Interactive Agreement Buttons */}
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
                        <button
                          id={`vote-agree-${view.id}`}
                          onClick={() => handleVote(view.id, "agree")}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            userVote === "agree"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600"
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${userVote === "agree" ? "fill-white" : ""}`} />
                          <span>{language === "it" ? "Sono d'accordo" : "I agree"}</span>
                        </button>

                        <button
                          id={`vote-disagree-${view.id}`}
                          onClick={() => handleVote(view.id, "disagree")}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            userVote === "disagree"
                              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                              : "bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600"
                          }`}
                        >
                          <ThumbsDown className={`w-3.5 h-3.5 ${userVote === "disagree" ? "fill-white" : ""}`} />
                          <span>{language === "it" ? "Non sono d'accordo" : "I disagree"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. TESTIMONIALS TAB: Interactive 1-5 star card + Anonymous testimonials */}
            {activeTab === "testimonials" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 max-w-2xl mx-auto gap-4">
                  {/* Interactive Star Rating Card */}
                  <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-amber-950/20 dark:via-[#1e293b] dark:to-amber-950/10 border-2 border-amber-200/90 dark:border-amber-700/60 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                          <span>{language === "it" ? "Lascia la tua valutazione" : "Leave your rating"}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {language === "it"
                            ? "Valuta Simone da 1 a 5 stelle per esprimere la tua opinione"
                            : "Rate Simone from 1 to 5 stars to share your opinion"}
                        </p>
                      </div>

                      {/* 5 Stars Interactive Widget */}
                      <div 
                        className={`flex items-center gap-1.5 p-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 border transition-all duration-200 shadow-2xs self-start sm:self-auto ${
                          isFlashingRed ? "border-red-300 dark:border-red-700 bg-red-50/60 dark:bg-red-950/40" : "border-amber-100 dark:border-amber-900/40"
                        }`}
                        onMouseLeave={() => {
                          setDisableHoverUntilLeave(false);
                          if (!isFlashingRed) setHoveredRating(null);
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isHovered = !isFlashingRed && !disableHoverUntilLeave && hoveredRating !== null && starVal <= hoveredRating;
                          const isSelected = !isFlashingRed && selectedRating !== null && starVal <= selectedRating;
                          const isActive = isHovered || (hoveredRating === null && isSelected);

                          return (
                            <button
                              key={starVal}
                              id={`rate-star-${starVal}`}
                              type="button"
                              disabled={isFlashingRed}
                              onMouseEnter={() => {
                                if (!isFlashingRed && !disableHoverUntilLeave) {
                                  setHoveredRating(starVal);
                                }
                              }}
                              onClick={() => handleSelectRating(starVal)}
                              className={`p-1 rounded-lg transition-all duration-150 cursor-pointer focus:outline-none ${
                                isFlashingRed ? "animate-red-flash pointer-events-none" : "hover:scale-125 active:scale-95"
                              }`}
                              aria-label={`Valuta ${starVal} stelle`}
                            >
                              <Star
                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                                  isFlashingRed
                                    ? "text-red-500 fill-red-500 drop-shadow-sm"
                                    : isActive
                                    ? "text-amber-500 fill-amber-400 drop-shadow-xs"
                                    : "text-slate-300 dark:text-slate-600 fill-slate-100 dark:fill-slate-800 hover:text-amber-300"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pop-up Toast / Message */}
                    <AnimatePresence>
                      {ratingToast && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 p-3.5 rounded-2xl bg-slate-900 text-white shadow-md flex items-center justify-between gap-3 text-sm font-semibold"
                        >
                          <div className="flex items-center gap-2.5">
                            <span>{ratingToast}</span>
                          </div>
                          <button
                            onClick={() => setRatingToast(null)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {testimonialsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-md transition-all group"
                    >
                      {/* Subtle decorative quote watermark */}
                      <div className="absolute top-3 right-3 text-amber-500/10 group-hover:text-amber-500/15 transition-colors pointer-events-none select-none">
                        <MessageSquareQuote className="w-14 h-14" />
                      </div>

                      <div className="mb-5 relative z-10">
                        {/* Rating stars: 1, 4, 5 filled stars, no numbers, no verified badge */}
                        <div className="flex items-center gap-1 mb-3.5">
                          {[...Array(5)].map((_, sIdx) => {
                            const isFilled = sIdx < item.stars;
                            return (
                              <svg
                                key={sIdx}
                                className={`w-4 h-4 ${isFilled ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700"}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            );
                          })}
                        </div>

                        {/* Prominent quotation marks and body */}
                        <div className="flex items-start gap-2.5">
                          <Quote className="w-6 h-6 text-amber-500 fill-amber-500/20 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed font-normal">
                            «{item.quote}»
                          </p>
                        </div>
                      </div>

                      {/* Author card footer: only 'Anonimo', no subtitle, no 'autentico' */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.bg} flex items-center justify-center shrink-0 shadow-2xs ring-2 ring-slate-100 dark:ring-slate-700`}>
                            {personIcon}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                              {item.author}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COMPARE TAB: Subtitle "Confronto cogli altri candidati" without period, with mobile touch */}
            {activeTab === "compare" && (
              <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60">
                      <GitCompare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {language === "it" ? "Perché scegliere Simone Armanni" : "Why Choose Simone Armanni"}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                        {language === "it" ? "Confronto cogli altri candidati" : "Comparison with other candidates"}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/80">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === "it" ? "Scelta consigliata" : "Top pick"}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {compareRows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 rounded-2xl bg-[#fafafa] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors space-y-2.5"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {row.trait}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 items-stretch">
                        {/* 1. Altro Candidato column (First) */}
                        <div
                          onTouchStart={() => setTouchActiveOtherRow(rIdx)}
                          onTouchEnd={() => setTouchActiveOtherRow(null)}
                          onTouchCancel={() => setTouchActiveOtherRow(null)}
                          className={`p-3.5 rounded-xl border flex items-start gap-2.5 h-full transition-colors group/other cursor-pointer select-none ${
                            !row.simoneWins
                              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200"
                              : "bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 min-w-6 min-h-6 rounded-lg shrink-0 mt-0.5 inline-flex items-center justify-center font-bold text-xs shadow-2xs transition-transform group-hover/other:scale-110 ${
                              !row.simoneWins
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {!row.simoneWins ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <>
                                <span className={`${touchActiveOtherRow === rIdx ? "hidden" : "inline"} group-hover/other:hidden select-none`}>✕</span>
                                <span className={`${touchActiveOtherRow === rIdx ? "inline" : "hidden"} group-hover/other:inline text-sm select-none leading-none`}>😡</span>
                              </>
                            )}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={`text-[11px] font-bold uppercase block mb-0.5 ${
                                !row.simoneWins
                                  ? "text-emerald-800 dark:text-emerald-400"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {language === "it" ? "Altro Candidato" : "Other Candidate"}
                            </span>
                            <p className="text-xs leading-relaxed font-normal">
                              {row.standard}
                            </p>
                          </div>
                        </div>

                        {/* 2. Simone Armanni column (Second) */}
                        <div
                          onTouchStart={() => setTouchActiveSimoneRow(rIdx)}
                          onTouchEnd={() => setTouchActiveSimoneRow(null)}
                          onTouchCancel={() => setTouchActiveSimoneRow(null)}
                          className={`p-3.5 rounded-xl border flex items-start gap-2.5 h-full transition-colors group/simone cursor-pointer select-none ${
                            row.simoneWins
                              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200"
                              : "bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 min-w-6 min-h-6 rounded-lg shrink-0 mt-0.5 inline-flex items-center justify-center font-bold text-xs shadow-2xs transition-transform group-hover/simone:scale-110 ${
                              row.simoneWins
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {row.simoneWins ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <>
                                <span className={`${touchActiveSimoneRow === rIdx ? "hidden" : "inline"} group-hover/simone:hidden select-none`}>✕</span>
                                <span className={`${touchActiveSimoneRow === rIdx ? "inline" : "hidden"} group-hover/simone:inline text-sm select-none leading-none`}>😢</span>
                              </>
                            )}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={`text-[11px] font-bold uppercase block mb-0.5 transition-colors ${
                                row.simoneWins
                                  ? "text-emerald-800 dark:text-emerald-400"
                                  : "text-slate-400 dark:text-slate-500 group-hover/simone:text-slate-700 dark:group-hover/simone:text-slate-300"
                              }`}
                            >
                              Simone Armanni
                            </span>
                            <p className="text-xs leading-relaxed font-medium">
                              {row.simone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. FAQ TAB */}
            {activeTab === "faq" && (
              <div className="space-y-4 animate-in fade-in duration-300 w-full min-w-0">
                {/* Header card for FAQ with black icon */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
                    <HelpCircle className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {language === "it" ? "Domande frequenti (FAQ)" : "Frequently Asked Questions (FAQ)"}
                    </h3>
                  </div>
                </div>

                {/* FAQ Cards List */}
                <div className="space-y-3.5">
                  {faqData.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="shrink-0 w-7 h-7 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold font-mono flex items-center justify-center mt-0.5 shadow-2xs">
                          {idx + 1}
                        </span>
                        <div className="space-y-2 flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                            {item.q}
                          </h4>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal with Animated Transition, Carousel Navigation & Isolated Drag-to-Dismiss */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 flex flex-col p-2 sm:p-6 backdrop-blur-md overflow-hidden select-none"
            onClick={() => setLightbox(null)}
          >
            {/* Modal Container: STATIC - DOES NOT DRAG (Only the photo itself moves when dragged) */}
            <div 
              className="relative max-w-5xl w-full h-full max-h-[92vh] mx-auto flex flex-col justify-between items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Controls Bar: Fixed at top, motionless when dragging photo */}
              <div className="w-full flex items-center justify-between py-2 sm:pb-3 text-white px-2 sm:px-4 shrink-0 z-30">
                <span className="text-xs sm:text-sm font-semibold font-mono text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-xs">
                  {toRoman(lightbox.index + 1)} / {toRoman(lightbox.images.length)}
                </span>

                <button
                  onClick={() => setLightbox(null)}
                  className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-all cursor-pointer shadow-md active:scale-95"
                  title="Chiudi (Esc)"
                  aria-label="Chiudi galleria"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Main Image Viewport Area with Carousel Navigation */}
              <div 
                ref={imageViewportRef}
                className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden touch-none"
                onClick={(e) => {
                  if (e.target === imageViewportRef.current) {
                    setLightbox(null);
                  }
                }}
              >
                {/* Desktop Previous Button: Centered vertically on desktop only, NOT on mobile */}
                {lightbox.images.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="hidden sm:flex absolute left-2 sm:left-4 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 active:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95 touch-manipulation items-center justify-center"
                    title="Precedente (←)"
                    aria-label="Immagine precedente"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}

                {/* 3-Slide Real-Time Carousel Track:
                    Zero-recoil continuous momentum glide matching iOS Photos app!
                    Adjacent photos already visible on left and right. */}
                {(() => {
                  const numImages = lightbox.images.length;
                  const currentIndex = lightbox.index;
                  const prevIndex = (currentIndex - 1 + numImages) % numImages;
                  const nextIndex = (currentIndex + 1) % numImages;

                  return (
                    <div
                      ref={trackRef}
                      className="relative w-full h-full flex items-center justify-center will-change-transform"
                      style={{
                        transform: `translate3d(${swipeOffset}px, ${verticalDragOffset}px, 0)`,
                        transition: isSnapAnimating
                          ? "transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)"
                          : "none",
                      }}
                    >
                      {/* Previous Slide (Slide -1): Positioned exactly left of current photo */}
                      {numImages > 1 && (
                        <div
                          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none select-none px-2 sm:px-4"
                          style={{
                            transform: "translateX(calc(-100% - 24px))",
                          }}
                        >
                          <img
                            src={lightbox.images[prevIndex].src}
                            alt={`Scatto ${toRoman(prevIndex + 1)}`}
                            className="max-w-full max-h-[68vh] sm:max-h-[75vh] rounded-2xl object-contain shadow-2xl border border-white/10"
                            draggable={false}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Current Active Slide (Slide 0) */}
                      <div
                        className="relative w-full h-full flex items-center justify-center select-none px-2 sm:px-4"
                        style={{
                          cursor: zoomScale > 1 ? (isPanningMouse ? "grabbing" : "grab") : "default",
                          touchAction: "none",
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onDoubleClick={handleDoubleClick}
                      >
                        <div
                          style={{
                            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
                            transition:
                              isPanningMouse || isTouchPanningActive
                                ? "none"
                                : "transform 0.24s cubic-bezier(0.2, 0.9, 0.3, 1)",
                            transformOrigin: "center center",
                          }}
                          className="max-w-full max-h-full flex items-center justify-center will-change-transform"
                        >
                          <img
                            key={lightbox.index}
                            src={lightbox.images[currentIndex].src}
                            alt={`Scatto ${toRoman(currentIndex + 1)}`}
                            className="max-w-full max-h-[68vh] sm:max-h-[75vh] rounded-2xl object-contain shadow-2xl border border-white/10 pointer-events-none select-none"
                            draggable={false}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      {/* Next Slide (Slide +1): Positioned exactly right of current photo */}
                      {numImages > 1 && (
                        <div
                          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none select-none px-2 sm:px-4"
                          style={{
                            transform: "translateX(calc(100% + 24px))",
                          }}
                        >
                          <img
                            src={lightbox.images[nextIndex].src}
                            alt={`Scatto ${toRoman(nextIndex + 1)}`}
                            className="max-w-full max-h-[68vh] sm:max-h-[75vh] rounded-2xl object-contain shadow-2xl border border-white/10"
                            draggable={false}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Desktop Next Button: Centered vertically on desktop only, NOT on mobile */}
                {lightbox.images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="hidden sm:flex absolute right-2 sm:right-4 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/85 active:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95 touch-manipulation items-center justify-center"
                    title="Successiva (→)"
                    aria-label="Immagine successiva"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
              </div>

              {/* Bottom Caption & Indicators: Stays motionless at bottom */}
              <div className="w-full flex flex-col items-center py-2 sm:pt-3 text-center px-4 shrink-0 z-30">
                <p className="text-sm sm:text-base font-bold text-white tracking-wide font-sans">
                  Scatto {toRoman(lightbox.index + 1)}
                </p>

                {/* Gallery Position Indicators & Mobile Navigation Arrows at the exact same height */}
                {lightbox.images.length > 1 && (
                  <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-2.5">
                    {/* Mobile Prev Arrow: Positioned at dot height, so it does NOT cover the photo */}
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="sm:hidden p-2 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white border border-white/20 transition-all cursor-pointer shadow-sm active:scale-90 flex items-center justify-center touch-manipulation"
                      title="Precedente"
                      aria-label="Immagine precedente"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Thumbnail dots */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {lightbox.images.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => {
                            resetZoom();
                            setLightbox((prev) => prev ? { ...prev, index: dotIdx } : null);
                          }}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            dotIdx === lightbox.index
                              ? "w-6 bg-indigo-500"
                              : "w-2 bg-white/30 hover:bg-white/60"
                          }`}
                          title={`Scatto ${toRoman(dotIdx + 1)}`}
                          aria-label={`Vai allo scatto ${toRoman(dotIdx + 1)}`}
                        />
                      ))}
                    </div>

                    {/* Mobile Next Arrow: Positioned at dot height, so it does NOT cover the photo */}
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="sm:hidden p-2 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white border border-white/20 transition-all cursor-pointer shadow-sm active:scale-90 flex items-center justify-center touch-manipulation"
                      title="Successiva"
                      aria-label="Immagine successiva"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
