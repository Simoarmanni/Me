import { useState, MouseEvent, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, AppLanguage } from "../types";
import { uiTranslations } from "../data/placeholderData";
import { HeroAnimatedBackground } from "./HeroAnimatedBackground";
import { PASTEL_SKILL_PALETTES } from "../utils/skillColors";
import { 
  MapPin, 
  Mail, 
  Download, 
  Check, 
  Copy, 
  Smile, 
  Layers,
  Sparkles
} from "lucide-react";

interface LandingAboutProps {
  profile: UserProfile;
  language: AppLanguage;
  onOpenEdit?: () => void;
  onScrollToWork?: () => void;
  onAvatarChange?: (avatar: string) => void;
}

export function LandingAbout({
  profile,
  language,
}: LandingAboutProps) {
  const t = uiTranslations[language];
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const avatarRetryRef = useRef(0);
  const [avatarSrc, setAvatarSrc] = useState<string>(() => {
    const saved = localStorage.getItem("simone_avatar");
    if (saved && saved !== "/DSC02231edit.jpg" && saved !== "/Media/Photos/Simone.jpg" && saved !== "./Media/Photos/Simone.jpg") {
      return saved;
    }
    return profile.avatarUrl || "./Media/Simone.jpg";
  });
  const [imgError, setImgError] = useState(false);

  const handleAvatarError = () => {
    const fallbackList = [
      "./Media/Simone.jpg",
      "./Media/Photos/Simone.jpg",
      "Media/Simone.jpg",
      "/My-website/Media/Simone.jpg",
      "/My-website/Media/Photos/Simone.jpg",
      "/Media/Simone.jpg"
    ];
    if (avatarRetryRef.current < fallbackList.length) {
      const nextCandidate = fallbackList[avatarRetryRef.current];
      avatarRetryRef.current += 1;
      if (nextCandidate !== avatarSrc) {
        setAvatarSrc(nextCandidate);
        return;
      }
    }
    setImgError(true);
  };
  const [showNextEmployee, setShowNextEmployee] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredSkillColors, setHoveredSkillColors] = useState<Record<string, string>>({});
  const skillLeaveTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const easterEggTimerRef = useRef<NodeJS.Timeout | null>(null);

  const softSkills = profile.softSkills || (language === "it" ? [
    "Adattabilità",
    "Pensiero laterale",
    "Creatività",
    "Gestione del tempo",
    "Attenzione ai dettagli"
  ] : [
    "Adaptability",
    "Lateral thinking",
    "Creativity",
    "Time management",
    "Attention to detail"
  ]);

  const totalSkillsCount = profile.keySkills.length + softSkills.length;

  // Check if at least 8 skills on desktop (or 7 on mobile) are colored simultaneously
  const checkEasterEgg = (colors: Record<string, string>) => {
    const activeCount = Object.keys(colors).length;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const requiredThreshold = isMobile ? 7 : 8;
    if (activeCount >= requiredThreshold) {
      setShowEasterEgg(true);
      if (easterEggTimerRef.current) {
        clearTimeout(easterEggTimerRef.current);
      }
      // Stays visible for at least 3 seconds (3.5s)
      easterEggTimerRef.current = setTimeout(() => {
        setShowEasterEgg(false);
      }, 3500);
    }
  };

  const assignSkillColor = (key: string) => {
    const current = hoveredSkillColors[key];
    const pool = PASTEL_SKILL_PALETTES.filter((p) => p !== current);
    const randomChoice = pool[Math.floor(Math.random() * pool.length)];
    setHoveredSkillColors((prev) => {
      const next = { ...prev, [key]: randomChoice };
      checkEasterEgg(next);
      return next;
    });
  };

  const handleSkillMouseEnter = (key: string) => {
    if (skillLeaveTimersRef.current[key]) {
      clearTimeout(skillLeaveTimersRef.current[key]);
      delete skillLeaveTimersRef.current[key];
    }
    if (!hoveredSkillColors[key]) {
      assignSkillColor(key);
    }
  };

  const handleSkillMouseLeave = (key: string) => {
    if (skillLeaveTimersRef.current[key]) {
      clearTimeout(skillLeaveTimersRef.current[key]);
    }
    // Remain colored for 1 second after mouse leaves
    skillLeaveTimersRef.current[key] = setTimeout(() => {
      setHoveredSkillColors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      delete skillLeaveTimersRef.current[key];
    }, 1000);
  };

  const handleSkillClick = (key: string) => {
    if (skillLeaveTimersRef.current[key]) {
      clearTimeout(skillLeaveTimersRef.current[key]);
    }
    assignSkillColor(key);
    // Keep colored for 1s on desktop, and 1.8s on mobile so user can easily tap 7 labels
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const clickDuration = isMobile ? 1800 : 1000;
    skillLeaveTimersRef.current[key] = setTimeout(() => {
      setHoveredSkillColors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      delete skillLeaveTimersRef.current[key];
    }, clickDuration);
  };

  const handleAvatarClick = () => {
    setIsFlipped((prev) => {
      const next = !prev;
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
      if (next) {
        // Automatically flip back after 3 seconds
        flipTimerRef.current = setTimeout(() => {
          setIsFlipped(false);
        }, 3000);
      }
      return next;
    });
  };

  const handleNameMouseEnter = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setShowNextEmployee(true);
    }, 200);
  };

  const isTouchActiveRef = useRef(false);

  const handleTouchStart = () => {
    isTouchActiveRef.current = true;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowNextEmployee(true);
  };

  const handleTouchEnd = () => {
    setShowNextEmployee(false);
    setTimeout(() => {
      isTouchActiveRef.current = false;
    }, 350);
  };

  const handleTouchCancel = () => {
    setShowNextEmployee(false);
    setTimeout(() => {
      isTouchActiveRef.current = false;
    }, 350);
  };

  const handleNameMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowNextEmployee(false);
  };

  const handleNameClick = () => {
    if (isTouchActiveRef.current) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowNextEmployee((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
      }
      if (easterEggTimerRef.current) {
        clearTimeout(easterEggTimerRef.current);
      }
      Object.values(skillLeaveTimersRef.current).forEach((timerId) => {
        if (timerId) clearTimeout(timerId as NodeJS.Timeout);
      });
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("simone_avatar");
    if (saved && saved !== "/DSC02231edit.jpg" && saved !== "/Media/Photos/Simone.jpg" && saved !== "./Media/Photos/Simone.jpg") {
      setAvatarSrc(saved);
      setImgError(false);
    } else {
      setAvatarSrc(profile.avatarUrl || "./Media/Simone.jpg");
      setImgError(false);
    }
  }, [profile.avatarUrl]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleWave = (e: MouseEvent) => {
    e.stopPropagation();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
  };

  const handleStatCardClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Fireworks effect shooting outward
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x, y },
      startVelocity: 35,
      ticks: 200,
      gravity: 0.85,
      colors: ["#6366f1", "#ec4899", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"],
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 60,
        origin: { x: Math.max(0.05, x - 0.04), y },
        startVelocity: 30,
        colors: ["#ec4899", "#f43f5e", "#a855f7"]
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 60,
        origin: { x: Math.min(0.95, x + 0.04), y },
        startVelocity: 30,
        colors: ["#3b82f6", "#10b981", "#6366f1"]
      });
    }, 120);
  };

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative pt-20 pb-8 sm:pt-22 md:pt-24 md:pb-11 px-4 sm:px-6 overflow-hidden hero-animated-bg bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50/70 dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#0b0f19] border-b border-slate-200/80 dark:border-slate-800 transition-colors scroll-mt-20 w-full max-w-full"
    >
      {/* Interactive mouse-moving background doodles */}
      <HeroAnimatedBackground containerRef={sectionRef} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main Landing Card: Minimalist White with delicate subtle gradient glow */}
        <div className="relative rounded-3xl bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 p-5 sm:p-8 md:p-10 shadow-xs transition-all hover:shadow-md">
          {/* Top Status and Greeting Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-pulse-radar absolute inline-flex h-full w-full rounded-full bg-emerald-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-xs"></span>
              </span>
              <span>{profile.status}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Hero Profile Block: Flip-Card Avatar + Name + Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            {/* Interactive 3D Flip Card Avatar */}
            <div className="self-start sm:self-center flex flex-col items-center">
              <div
                className="relative cursor-pointer select-none group"
                style={{ perspective: "1000px" }}
                onClick={handleAvatarClick}
              >
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 relative transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front Face: Avatar Image with Fallback */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-1 bg-gradient-to-tr from-rose-400 via-violet-400 to-indigo-500 shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {!imgError ? (
                      <img
                        src={avatarSrc}
                        alt={profile.name}
                        onError={handleAvatarError}
                        className="w-full h-full object-cover rounded-xl bg-slate-100"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                        <span className="text-2xl font-bold tracking-tight font-sans text-emerald-200">
                          SA
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-400/90 mt-0.5">
                          Simone
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Back Face: Card Back with translated "Hai già visto abbastanza" */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-2.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col items-center justify-center text-center border-2 border-indigo-400/40"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p className="text-xs sm:text-sm font-bold text-rose-300 leading-snug px-2 font-mono">
                      {t.hero.flippedText}
                    </p>
                  </div>
                </div>

                {/* Playful greeting sticker */}
                <button
                  type="button"
                  onClick={handleWave}
                  title="Fai un saluto!"
                  className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-700 flex items-center gap-1 hover:bg-slate-50 cursor-pointer transition-transform active:scale-95 z-10"
                >
                  <span className={`inline-block transition-transform ${isWaving ? "rotate-45" : ""}`}>👋</span>
                  <span className="text-[10px]">{language === "it" ? "Ciao!" : "Hi!"}</span>
                </button>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 
                  onClick={handleNameClick}
                  onMouseEnter={handleNameMouseEnter}
                  onMouseLeave={handleNameMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchCancel}
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-sans transition-all duration-300 cursor-pointer select-none touch-manipulation break-words ${
                    showNextEmployee 
                      ? "font-extrabold bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-flow" 
                      : "text-slate-900 dark:text-white"
                  }`}
                  title={showNextEmployee ? (language === "it" ? "Sì, proprio io!" : "Yes, exactly me!") : undefined}
                >
                  {showNextEmployee 
                    ? (language === "it" ? "Il tuo prossimo collega" : "Your next colleague") 
                    : profile.name}
                </h1>
              </div>

              <p className="text-base sm:text-lg font-medium text-indigo-600 dark:text-indigo-400">
                {profile.role}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 italic max-w-xl">
                "{profile.tagline}"
              </p>
            </div>
          </div>

          {/* Breve Descrizione Su di Me (The Landing Page Core) */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <Smile className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                {language === "it" ? "Mi presento" : "About me"}
              </h2>
            </div>

            {/* Paragraphs with uniform typography */}
            <div className="space-y-3 text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              <p>
                {profile.shortBio}
              </p>
              {profile.extendedBio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Quick Metrics / Playful Bento Highlights with Fireworks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
            {profile.stats.map((stat, idx) => (
              <div
                key={idx}
                onClick={handleStatCardClick}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 hover:bg-violet-100/90 dark:hover:bg-violet-900/50 hover:shadow-md hover:shadow-violet-500/15 transition-all cursor-pointer active:scale-95 group select-none"
                title={language === "it" ? "Clicca per festeggiare!" : "Click for fireworks!"}
              >
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-violet-900 dark:group-hover:text-violet-200 mt-1 transition-colors first-letter:uppercase">
                  {stat.label ? stat.label.charAt(0).toUpperCase() + stat.label.slice(1) : ""}
                </div>
                {stat.sublabel && (
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 group-hover:text-violet-600/80 dark:group-hover:text-violet-300/80 mt-0.5 transition-colors">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key skills & Soft skills pills with subtle pastel borders */}
          <div className="mb-5 relative space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>{language === "it" ? "Competenze Chiave e Tecnologie" : "Core Competencies and Tools"}</span>
                </div>

                {/* Counter subtle cue when activating skills */}
                {Object.keys(hoveredSkillColors).length > 0 && (
                  <span className="text-[11px] font-mono text-violet-600 dark:text-violet-400 font-semibold">
                    {Object.keys(hoveredSkillColors).length} / {totalSkillsCount}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.keySkills.map((skill, idx) => {
                  const skillKey = `tech-${idx}`;
                  const activePastel = hoveredSkillColors[skillKey];
                  return (
                    <span
                      key={skillKey}
                      onMouseEnter={() => handleSkillMouseEnter(skillKey)}
                      onMouseLeave={() => handleSkillMouseLeave(skillKey)}
                      onClick={() => handleSkillClick(skillKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none shadow-2xs border ${
                        activePastel
                          ? `${activePastel} shadow-xs scale-105`
                          : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 hover:scale-105"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Soft Skills placed under Competenze Chiave e Tecnologie maintaining the exact same format */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Soft skills</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, idx) => {
                  const skillKey = `soft-${idx}`;
                  const activePastel = hoveredSkillColors[skillKey];
                  return (
                    <span
                      key={skillKey}
                      onMouseEnter={() => handleSkillMouseEnter(skillKey)}
                      onMouseLeave={() => handleSkillMouseLeave(skillKey)}
                      onClick={() => handleSkillClick(skillKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none shadow-2xs border ${
                        activePastel
                          ? `${activePastel} shadow-xs scale-105`
                          : "bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 hover:scale-105"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Easter Egg Pop-up: "Beato te che ti diverti con poco" positioned below the pills, no emoji */}
            <AnimatePresence>
              {showEasterEgg && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold"
                >
                  <span>
                    {(t.hero as unknown as { easterEggFunWithLittle?: string }).easterEggFunWithLittle ||
                      (language === "it" ? "Beato te che ti diverti con poco" : "It takes so little to keep you entertained")}
                  </span>
                  <button
                    onClick={() => setShowEasterEgg(false)}
                    className="p-1 rounded-lg hover:bg-amber-200/60 dark:hover:bg-amber-900/60 transition-colors text-amber-700 dark:text-amber-400 cursor-pointer text-xs"
                    aria-label={language === "it" ? "Chiudi" : "Close"}
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                id="hero-download-cv-btn"
                href="./Media/CV-Armanni.pdf"
                download="CV-Armanni.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center h-11 gap-2 px-5 rounded-xl bg-slate-900 dark:bg-violet-600 hover:bg-violet-900 dark:hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer group"
                title={language === "it" ? "Scarica Curriculum Vitae (PDF)" : "Download Curriculum Vitae (PDF)"}
              >
                <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                <span>{t.hero.printCV}</span>
              </a>
            </div>

            {/* Quick Email Copy Chip */}
            <button
              onClick={handleCopyEmail}
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 gap-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-violet-100/90 dark:hover:bg-violet-900/60 text-slate-600 dark:text-slate-300 hover:text-violet-900 dark:hover:text-violet-200 border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 text-xs sm:text-sm font-mono transition-colors cursor-pointer truncate max-w-full"
              title={language === "it" ? "Clicca per copiare l'indirizzo email" : "Click to copy email address"}
            >
              <Mail className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
              <span className="truncate">{profile.email}</span>
              {copiedEmail ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold font-sans shrink-0">
                  <Check className="w-3.5 h-3.5" /> {t.contact.copied}
                </span>
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
