import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { WorkItem, EducationItem, AppLanguage } from "../types";
import { uiTranslations } from "../data/placeholderData";
import { InteractiveDotGrid } from "./InteractiveDotGrid";
import { 
  MapPin, 
  Award, 
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface WorkAndEducationTimelineProps {
  workItems: WorkItem[];
  education: EducationItem[];
  language: AppLanguage;
  filter?: TimelineFilter;
  onFilterChange?: (filter: TimelineFilter) => void;
}

export type TimelineFilter = "all" | "work" | "education";
export type MilestoneType = "work" | "education";

export interface TimelineMilestone {
  id: string;
  type: MilestoneType;
  yearDisplay: string;
  endYearNumber: number;
  startYearNumber: number;
  title: string;
  subtitle: string;
  location?: string;
  typeOrGrade?: string;
  description: string;
  skills: string[];
  isCurrent?: boolean;
  workItem?: WorkItem;
  educationItem?: EducationItem;
}

/**
 * Helper to ensure NO MONTHS are displayed anywhere.
 * Extracts only 4-digit years.
 */
export function formatPeriodYearsOnly(periodStr: string): string {
  if (!periodStr) return "";
  const matches = periodStr.match(/\b(19\d{2}|20\d{2})\b/g);
  if (matches && matches.length > 0) {
    if (matches.length === 1) return matches[0];
    if (matches[0] === matches[1]) return matches[0];
    return `${matches[0]} — ${matches[1]}`;
  }
  return periodStr
    .replace(/(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/gi, "")
    .replace(/(january|february|march|april|may|june|july|august|september|october|november|december)/gi, "")
    .replace(/(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?/gi, "")
    .replace(/\s*—\s*/g, " — ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseYears(periodStr: string): { startYear: number; endYear: number } {
  const matches = periodStr.match(/\b(19\d{2}|20\d{2})\b/g);
  if (!matches || matches.length === 0) return { startYear: 2020, endYear: 2020 };
  const nums = matches.map((m) => parseInt(m, 10));
  if (nums.length === 1) return { startYear: nums[0], endYear: nums[0] };
  return {
    startYear: Math.min(...nums),
    endYear: Math.max(...nums),
  };
}

export function WorkAndEducationTimeline({
  workItems,
  education,
  language,
  filter: controlledFilter,
  onFilterChange,
}: WorkAndEducationTimelineProps) {
  const t = uiTranslations[language];
  const [internalFilter, setInternalFilter] = useState<TimelineFilter>("all");
  const filter = controlledFilter !== undefined ? controlledFilter : internalFilter;

  const setFilter = useCallback((newFilter: TimelineFilter) => {
    setInternalFilter(newFilter);
    onFilterChange?.(newFilter);
  }, [onFilterChange]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // References for horizontal scrolling
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isScrollingInternalRef = useRef(false);

  // Unified list of milestones sorted backwards in years
  const allMilestones: TimelineMilestone[] = useMemo(() => {
    const list: TimelineMilestone[] = [];

    // Map work items (with full text and always-visible technologies)
    workItems.forEach((w) => {
      const cleanYear = formatPeriodYearsOnly(w.period);
      const { startYear, endYear } = parseYears(w.period);
      list.push({
        id: w.id,
        type: "work",
        yearDisplay: cleanYear,
        endYearNumber: endYear,
        startYearNumber: startYear,
        title: w.role,
        subtitle: w.company,
        location: w.location,
        typeOrGrade: w.type,
        description: w.description,
        skills: w.technologies || [],
        isCurrent: w.current,
        workItem: w,
      });
    });

    // Map education items
    education.forEach((e) => {
      const cleanYear = formatPeriodYearsOnly(e.period);
      const { startYear, endYear } = parseYears(e.period);
      list.push({
        id: e.id,
        type: "education",
        yearDisplay: cleanYear,
        endYearNumber: endYear,
        startYearNumber: startYear,
        title: e.degree,
        subtitle: e.institution,
        location: e.location,
        typeOrGrade: e.grade ? `Voto: ${e.grade}` : undefined,
        description: e.description,
        skills: e.skillsAcquired || [],
        educationItem: e,
      });
    });

    // Sort going backwards in time
    list.sort((a, b) => {
      if (b.endYearNumber !== a.endYearNumber) {
        return b.endYearNumber - a.endYearNumber;
      }
      if (b.startYearNumber !== a.startYearNumber) {
        return b.startYearNumber - a.startYearNumber;
      }
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      if (a.type === "work" && b.type === "education") return -1;
      if (a.type === "education" && b.type === "work") return 1;
      return 0;
    });

    return list;
  }, [workItems, education]);

  // Filtered milestones
  const visibleMilestones: TimelineMilestone[] = useMemo(() => {
    if (filter === "work") {
      return allMilestones.filter((m) => m.type === "work");
    }
    if (filter === "education") {
      return allMilestones.filter((m) => m.type === "education");
    }
    return allMilestones;
  }, [allMilestones, filter]);

  const targetIndexRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Scroll to center card horizontally within the carousel container ONLY (never moves window)
  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current;
    const targetCard = cardRefs.current[index];
    if (container && targetCard) {
      isScrollingInternalRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior,
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingInternalRef.current = false;
      }, 350);
    }
  }, []);

  const handleNavPrev = useCallback(() => {
    const prev = Math.max(0, targetIndexRef.current - 1);
    targetIndexRef.current = prev;
    setActiveIndex(prev);
    scrollToCard(prev);
  }, [scrollToCard]);

  const handleNavNext = useCallback(() => {
    const next = Math.min(visibleMilestones.length - 1, targetIndexRef.current + 1);
    targetIndexRef.current = next;
    setActiveIndex(next);
    scrollToCard(next);
  }, [visibleMilestones.length, scrollToCard]);

  // Reset active index when filter changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      targetIndexRef.current = 0;
      setActiveIndex(0);
      setScrollProgress(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
      return;
    }
    targetIndexRef.current = 0;
    setActiveIndex(0);
    setScrollProgress(0);
    scrollToCard(0, "instant");
  }, [filter, scrollToCard]);

  // External tab navigation events
  useEffect(() => {
    const handleSetTab = (e: CustomEvent) => {
      if (e.detail?.tab === "work") {
        setFilter("work");
      } else if (e.detail?.tab === "education") {
        setFilter("education");
      } else if (e.detail?.tab === "all") {
        setFilter("all");
      }
    };

    window.addEventListener("simone_timeline_filter" as any, handleSetTab);
    return () => {
      window.removeEventListener("simone_timeline_filter" as any, handleSetTab);
    };
  }, [setFilter]);

  // Keyboard Arrow Left & Arrow Right listener for instant card navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNavNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleNavPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavNext, handleNavPrev]);

  /**
   * Automatic scroll detection & scrollProgress tracking.
   * Uses viewport-based getBoundingClientRect() so the truly centered card
   * is always perfectly detected with zero offset distortion.
   */
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Track scrollProgress from 0 (start) to 1 (end) for dot thinning
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll > 0) {
      const progress = Math.min(1, Math.max(0, container.scrollLeft / maxScroll));
      setScrollProgress(progress);
    }

    if (isScrollingInternalRef.current) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((cardEl, idx) => {
      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = idx;
        }
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
      targetIndexRef.current = closestIndex;
    }
  };

  // Mouse drag handlers
  const hasDraggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const deltaX = e.pageX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      container.scrollLeft = scrollLeftRef.current - deltaX * 1.2;
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    // Only snap if the user was actively dragging
    if (hasDraggedRef.current) {
      setTimeout(() => {
        scrollToCard(targetIndexRef.current);
      }, 50);
    }
  };

  const handleCardClick = (idx: number) => {
    if (hasDraggedRef.current) return;
    if (idx === activeIndex) return;
    targetIndexRef.current = idx;
    setActiveIndex(idx);
    scrollToCard(idx);
  };

  return (
    <section 
      id="esperienze" 
      className="py-8 md:py-11 bg-[#fafafa] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 transition-colors scroll-mt-16 md:scroll-mt-20 relative overflow-hidden w-full cursor-default"
    >
      {/* Anchors for legacy navigation compatibility */}
      <div id="lavoro" className="absolute top-0 pointer-events-none" aria-hidden="true" />
      <div id="esperienza" className="absolute top-0 pointer-events-none" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* SFONDO CON PUNTINI INTERATTIVI CHE DIMINUISCONO MAN MANO CHE SI SCORRE    */}
      {/* ========================================================================= */}
      <InteractiveDotGrid 
        scrollProgress={scrollProgress} 
        dotRadius={1.5} 
        spacing={22} 
        maxDistance={120} 
        maxPull={6.0} 
      />

      {/* ========================================================================= */}
      {/* 1. SECTION HEADER (Una sola icona: la valigia; frecce di navigazione a dx) */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-5 relative z-10 select-text">
        <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              {/* Solo la valigia (Briefcase) */}
              <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100/80 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 inline-flex items-center justify-center shrink-0 shadow-2xs">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 dark:text-rose-400" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight select-text">
                {language === "it" ? "Esperienze e Formazione" : "Experience & Education"}
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl select-text">
              {language === "it" 
                ? "Il mio percorso professionale e accademico"
                : "My professional and academic journey"}
            </p>
          </div>

          {/* Frecce di navigazione per chi non usa il trackpad */}
          <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
            <button
              onClick={handleNavPrev}
              disabled={activeIndex <= 0}
              aria-label={language === "it" ? "Tappa precedente" : "Previous stage"}
              title={language === "it" ? "Tappa precedente" : "Previous stage"}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                activeIndex <= 0
                  ? "opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                  : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-slate-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNavNext}
              disabled={activeIndex >= visibleMilestones.length - 1}
              aria-label={language === "it" ? "Tappa successiva" : "Next stage"}
              title={language === "it" ? "Tappa successiva" : "Next stage"}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                activeIndex >= visibleMilestones.length - 1
                  ? "opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                  : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-slate-300"
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD RETTANGOLARI UNIFORMI (TESTO MAI TAGLIATO, ALTEZZA OTTIMIZZATA)   */}
      {/* Competenze: semplici etichette senza colorazioni. Testo selezionabile.     */}
      {/* ========================================================================= */}
      <div className="w-full relative py-1 z-10">
        {/* Soft edge fade scrims */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#fafafa] dark:from-[#0b0f19] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#fafafa] dark:from-[#0b0f19] to-transparent z-20" />

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-full overflow-x-auto snap-x snap-proximity pt-1 pb-4 focus:outline-none cursor-default no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "calc(50vw - min(46vw, 275px))",
            paddingRight: "calc(50vw - min(46vw, 275px))",
          }}
        >
          {/* Continuous Row of Wider Cards */}
          <div className="relative min-w-max flex items-stretch gap-6 sm:gap-8 px-4 cursor-default select-text">
            {visibleMilestones.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isWork = item.type === "work";

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => handleCardClick(idx)}
                  role={isActive ? undefined : "button"}
                  tabIndex={isActive ? undefined : 0}
                  onKeyDown={(e) => {
                    if (!isActive && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleCardClick(idx);
                    }
                  }}
                  aria-label={
                    isActive
                      ? undefined
                      : language === "it"
                      ? `Visualizza ${item.title}`
                      : `View ${item.title}`
                  }
                  className={`snap-center shrink-0 flex flex-col justify-between rounded-3xl p-5 sm:p-5.5 transition-all duration-300 relative border select-text ${
                    isActive
                      ? isWork
                        ? "bg-white dark:bg-[#141b2c] border-rose-300/90 dark:border-rose-900/80 shadow-md ring-2 ring-rose-500/10 scale-100 z-10 cursor-default"
                        : "bg-white dark:bg-[#141b2c] border-indigo-300/90 dark:border-indigo-900/80 shadow-md ring-2 ring-indigo-500/10 scale-100 z-10 cursor-default"
                      : "bg-white/90 dark:bg-[#111726]/80 border-slate-200/80 dark:border-slate-800/80 opacity-70 hover:opacity-100 hover:shadow-lg cursor-pointer hover:-translate-y-0.5"
                  }`}
                  /* SCHEDE LARGHE 550px E ALTEZZA MINIMA 365px: IL TESTO NON VIENE MAI TAGLIATO */
                  style={{
                    width: "min(92vw, 550px)",
                    minHeight: "365px",
                  }}
                >
                  {/* Top section: Year, Category, Current Role, Titles & Full Description */}
                  <div className="flex-1 flex flex-col">
                    {/* Top Bar: Left = Year; Right = Location, Type & Icon badge */}
                    <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                      {/* Left: Year & active role */}
                      <div className="flex items-center gap-2">
                        <span className={`text-base sm:text-lg font-black tracking-tight tabular-nums select-text ${
                          isWork ? "text-rose-600 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"
                        }`}>
                          {item.yearDisplay}
                        </span>

                        {item.isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t.workSection.currentRole}
                          </span>
                        )}
                      </div>

                      {/* Right: Location (solo lavoro), Type/Grade & Icona uniforme */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isWork && item.location && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                            <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            <span>{item.location}</span>
                          </span>
                        )}
                        {item.typeOrGrade && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                            {!isWork && <Award className="w-3 h-3 text-emerald-500" />}
                            <span>{item.typeOrGrade}</span>
                          </span>
                        )}
                        {/* Icona lavoro/formazione uniformata alle altre etichette */}
                        <span 
                          title={isWork ? (language === "it" ? "Esperienza lavorativa" : "Work experience") : (language === "it" ? "Formazione" : "Education")}
                          aria-label={isWork ? (language === "it" ? "Esperienza lavorativa" : "Work experience") : (language === "it" ? "Formazione" : "Education")}
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs ${
                            isWork
                              ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/70"
                              : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-900/70"
                          }`}
                        >
                          {isWork ? (
                            <Briefcase className="w-3.5 h-3.5" />
                          ) : (
                            <GraduationCap className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Title (Full role or degree) */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug shrink-0 select-text">
                      {item.title}
                    </h3>

                    {/* Company / Institution */}
                    <div className={`text-sm sm:text-base font-semibold mt-0.5 shrink-0 select-text ${
                      isWork ? "text-rose-600 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"
                    }`}>
                      {item.subtitle}
                    </div>

                    {/* TESTO COMPLETO MAI TAGLIATO (Selezionabile) */}
                    <div className="pt-2 mt-1.5 border-t border-slate-200/80 dark:border-slate-800">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans select-text">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* =================================================== */}
                  {/* COMPETENZE: SEMPLICI ETICHETTE COMPATTE             */}
                  {/* =================================================== */}
                  <div className="pt-2 mt-1.5 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 select-text">
                      {language === "it" ? "Competenze e strumenti" : "Skills & tools"}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-medium bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 select-text"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SWITCH TUTTO / LAVORO / FORMAZIONE IN BASSO A SINISTRA SOTTO LE CARD   */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 relative z-10">
        <div className="flex items-center">
          <div className="flex items-center gap-1 p-1 bg-white/95 dark:bg-slate-800/95 rounded-xl border border-slate-200/90 dark:border-slate-700/90 shadow-2xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {language === "it" ? "Tutte le tappe" : "All stages"} ({allMilestones.length})
            </button>
            <button
              onClick={() => setFilter(filter === "work" ? "all" : "work")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filter === "work"
                  ? "bg-rose-600 text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === "it" ? "Lavoro" : "Work"}</span>
            </button>
            <button
              onClick={() => setFilter(filter === "education" ? "all" : "education")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filter === "education"
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === "it" ? "Formazione" : "Education"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. PRINT VIEW: Completo per esportazione CV              */}
      {/* ======================================================== */}
      <div className="hidden print:block max-w-4xl mx-auto px-6 space-y-6 mt-8 bg-white text-black p-6">
        <div className="border-b border-black pb-2 mb-4">
          <h3 className="text-xl font-bold text-black uppercase">
            {language === "it" ? "Esperienze Lavorative" : "Work Experience"}
          </h3>
        </div>
        {workItems.map((item) => (
          <div key={`print-${item.id}`} className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-black text-base">{item.role} — {item.company}</h4>
              <span className="text-sm text-gray-700">{formatPeriodYearsOnly(item.period)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            {item.technologies?.length > 0 && (
              <p className="text-xs text-gray-700 mt-1.5 font-semibold">
                Competenze e strumenti: {item.technologies.join(", ")}
              </p>
            )}
            {item.achievements?.length > 0 && (
              <ul className="list-disc list-inside text-xs text-gray-800 mt-2 space-y-1">
                {item.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="border-b border-black pb-2 mb-4 mt-6">
          <h3 className="text-xl font-bold text-black uppercase">
            {language === "it" ? "Formazione e Studi" : "Education"}
          </h3>
        </div>
        {education.map((item) => (
          <div key={`print-${item.id}`} className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-black text-base">{item.degree} — {item.institution}</h4>
              <span className="text-sm text-gray-700">{formatPeriodYearsOnly(item.period)}</span>
            </div>
            {item.grade && <p className="text-xs font-semibold text-gray-700">Voto: {item.grade}</p>}
            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
            {item.skillsAcquired?.length > 0 && (
              <p className="text-xs text-gray-700 mt-1.5 font-semibold">
                Competenze acquisite: {item.skillsAcquired.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
