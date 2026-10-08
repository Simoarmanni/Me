import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  initialProfileIT,
  initialProfileEN,
  initialWorkExperienceIT,
  initialWorkExperienceEN,
  initialEducationIT,
  initialEducationEN,
  initialLanguagesIT,
  initialLanguagesEN,
  initialPassionsIT,
  initialPassionsEN,
  initialPoliticalViewsIT,
  initialPoliticalViewsEN,
} from "./data/placeholderData";
import { AppLanguage, UserProfile } from "./types";
import { Navbar } from "./components/Navbar";
import { LandingAbout } from "./components/LandingAbout";
import { WorkAndEducationTimeline, TimelineFilter } from "./components/WorkAndEducationTimeline";
import { LanguagesSection } from "./components/LanguagesSection";
import { DiscoverMoreSection } from "./components/DiscoverMoreSection";
import { ContactSection } from "./components/ContactSection";
import { EditProfileModal } from "./components/EditProfileModal";
import { ArrowUp } from "lucide-react";

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("cv_app_language") || localStorage.getItem("simone_lang");
    if (saved === "en" || saved === "it") return saved as AppLanguage;

    // Detect if user visits from outside Italy:
    // If browser language is not Italian and timezone is not Europe/Rome, default to "en"
    try {
      const languages = navigator.languages || [navigator.language || ""];
      const isItalianLang = languages.some((l) => l.toLowerCase().startsWith("it"));
      const timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
      const isItalianTz = timeZone.includes("rome") || timeZone.includes("italy");

      if (!isItalianLang && !isItalianTz) {
        return "en";
      }
    } catch (e) {
      console.warn("Location detection error:", e);
    }
    return "it";
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("simone_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("simone_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("simone_theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Custom profile state, synced with current language defaults
  const [customProfileIT, setCustomProfileIT] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("cv_user_profile_it");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed.name !== "Marco Rossi") {
          if (parsed.role === "Specialista in Comunicazione & Media Production") {
            parsed.role = "Specialista in Comunicazione e Produzione di Contenuti";
          }
          if (parsed.tagline === "Storytelling narrativo, produzione video e strategie cross-mediali con precisione e visione strategica.") {
            parsed.tagline = "Amo lavorare, lo giuro";
          }
          // If stored bio was the previous default, update to new bio
          if (
            parsed.shortBio?.includes("Professionista della comunicazione") || 
            parsed.shortBio?.includes("Curioso di default") ||
            parsed.shortBio?.includes("Te vieni qua e ti aspetti") ||
            !parsed.extendedBio?.[0]?.includes("tarocchi")
          ) {
            parsed.shortBio = initialProfileIT.shortBio;
            parsed.extendedBio = initialProfileIT.extendedBio;
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [customProfileEN, setCustomProfileEN] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("cv_user_profile_en");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed.name !== "Marco Rossi") {
          if (parsed.role === "Communication Specialist & Media Production") {
            parsed.role = "Communication and Content Production Specialist";
          }
          if (parsed.tagline?.startsWith("Narrative storytelling")) {
            parsed.tagline = "I love working, I swear";
          }
          // If stored bio was the previous default, update to new bio
          if (
            parsed.shortBio?.includes("Communication professional with") || 
            parsed.shortBio?.includes("Curious by nature, allergic to dullness") ||
            parsed.shortBio?.includes("You come here expecting to read") ||
            !parsed.extendedBio?.[0]?.includes("tarot")
          ) {
            parsed.shortBio = initialProfileEN.shortBio;
            parsed.extendedBio = initialProfileEN.extendedBio;
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [customAvatar, setCustomAvatar] = useState<string | null>(() => {
    const saved = localStorage.getItem("simone_avatar") || localStorage.getItem("cv_user_avatar");
    if (saved && saved !== "/DSC02231edit.jpg" && saved !== "/Media/Photos/Simone.jpg" && saved !== "./Media/Photos/Simone.jpg") {
      return saved;
    }
    return "./Media/Simone.jpg";
  });

  // Active profile resolved
  const activeProfileBase = language === "it" ? (customProfileIT || initialProfileIT) : (customProfileEN || initialProfileEN);
  const cleanLocation = (activeProfileBase.location || "")
    .replace(/\s*\(Disponibile da remoto[^)]*\)/gi, "")
    .replace(/\s*\(Available remote[^)]*\)/gi, "")
    .trim();

  const profile: UserProfile = {
    ...activeProfileBase,
    location: cleanLocation,
    avatarUrl: customAvatar || activeProfileBase.avatarUrl,
    flickr: activeProfileBase.flickr?.includes("simoarmanni") ? activeProfileBase.flickr : "https://www.flickr.com/people/simoarmanni/"
  };

  const workItems = language === "it" ? initialWorkExperienceIT : initialWorkExperienceEN;
  const education = language === "it" ? initialEducationIT : initialEducationEN;
  const languages = language === "it" ? initialLanguagesIT : initialLanguagesEN;
  const passions = language === "it" ? initialPassionsIT : initialPassionsEN;
  const politicalViews = language === "it" ? initialPoliticalViewsIT : initialPoliticalViewsEN;

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");
  const timelineFilterRef = useRef<TimelineFilter>("all");

  useEffect(() => {
    timelineFilterRef.current = timelineFilter;
  }, [timelineFilter]);

  // Ensure page always starts at top on initial load
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const handleFilterSync = (e: CustomEvent) => {
      if (e.detail?.tab && ["all", "work", "education"].includes(e.detail.tab)) {
        setTimelineFilter(e.detail.tab);
      }
    };
    window.addEventListener("simone_timeline_filter" as any, handleFilterSync);
    return () => {
      window.removeEventListener("simone_timeline_filter" as any, handleFilterSync);
    };
  }, []);

  const lastScrollYRef = useRef(0);
  const cumulativeUpScrollRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrollingUp = currentScrollY < lastScrollYRef.current;

          if (isScrollingUp) {
            const delta = lastScrollYRef.current - currentScrollY;
            cumulativeUpScrollRef.current += delta;
            // Only show if scrolled down significantly (> 300px) AND scrolled up smoothly by at least 120px
            if (currentScrollY > 300 && cumulativeUpScrollRef.current >= 120) {
              setShowScrollTop(true);
            }
          } else {
            // Reset upward accumulation on downward scroll
            cumulativeUpScrollRef.current = 0;
            setShowScrollTop(false);
          }

          // Hide if near the top
          if (currentScrollY <= 150) {
            setShowScrollTop(false);
            cumulativeUpScrollRef.current = 0;
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleLanguage = () => {
    const nextLang = language === "it" ? "en" : "it";
    setLanguage(nextLang);
    localStorage.setItem("cv_app_language", nextLang);
  };

  const handleSelectLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    localStorage.setItem("cv_app_language", lang);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    if (language === "it") {
      setCustomProfileIT(updated);
      localStorage.setItem("cv_user_profile_it", JSON.stringify(updated));
    } else {
      setCustomProfileEN(updated);
      localStorage.setItem("cv_user_profile_en", JSON.stringify(updated));
    }
    if (updated.avatarUrl) {
      setCustomAvatar(updated.avatarUrl);
      localStorage.setItem("simone_avatar", updated.avatarUrl);
    }
  };

  const handleResetProfile = () => {
    if (language === "it") {
      setCustomProfileIT(null);
      localStorage.removeItem("cv_user_profile_it");
    } else {
      setCustomProfileEN(null);
      localStorage.removeItem("cv_user_profile_en");
    }
    setCustomAvatar(null);
    localStorage.removeItem("simone_avatar");
    localStorage.removeItem("cv_user_avatar");
  };

  const scrollToWork = () => {
    const el = document.getElementById("esperienze") || document.getElementById("lavoro");
    if (el) {
      const nav = document.getElementById("main-navbar");
      const navHeight = nav ? nav.offsetHeight : 56;
      const targetY = window.pageYOffset + el.getBoundingClientRect().top - navHeight - 12;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowScrollTop(false);
    cumulativeUpScrollRef.current = 0;
  };

  // Keyboard shortcut feedback toast state
  const [shortcutToast, setShortcutToast] = useState<{ key: string; label: string } | null>(null);
  const shortcutToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showShortcutToast = (key: string, label: string) => {
    if (shortcutToastTimerRef.current) clearTimeout(shortcutToastTimerRef.current);
    setShortcutToast({ key, label });
    shortcutToastTimerRef.current = setTimeout(() => {
      setShortcutToast(null);
    }, 1400);
  };

  // Keyboard shortcuts: 1=About, 2=Work, 3=Education, 4=Languages, 5=Passions, 6=Politics, 7=Testimonials, 8=Compare, 9=FAQ, 0=Contact
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      // Ignore if modifier keys (Cmd, Ctrl, Alt) are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      // Keyboard shortcut L: Cambia lingua (IT <-> EN)
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        const nextLang = language === "it" ? "en" : "it";
        setLanguage(nextLang);
        localStorage.setItem("cv_app_language", nextLang);
        showShortcutToast("L", nextLang === "it" ? "Lingua: Italiano" : "Language: English");
        return;
      }

      // Keyboard shortcut D: Modalità notte (Light <-> Dark)
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setIsDarkMode((prev) => {
          const next = !prev;
          showShortcutToast(
            "D",
            next
              ? (language === "it" ? "Modalità notte: Attiva" : "Dark mode: On")
              : (language === "it" ? "Modalità notte: Disattivata" : "Dark mode: Off")
          );
          return next;
        });
        return;
      }

      let digit: string | null = null;
      if (e.key >= "0" && e.key <= "9") {
        digit = e.key;
      } else if (e.code.startsWith("Digit") && e.code.length === 6) {
        digit = e.code.replace("Digit", "");
      } else if (e.code.startsWith("Numpad") && e.code.length === 7) {
        digit = e.code.replace("Numpad", "");
      }

      if (!digit) return;

      const scrollToSection = (id: string) => {
        window.dispatchEvent(new CustomEvent("simone_close_lightbox"));
        const el = document.getElementById(id);
        if (el) {
          const nav = document.getElementById("main-navbar");
          const navHeight = nav ? nav.offsetHeight : 56;
          const targetY = window.pageYOffset + el.getBoundingClientRect().top - navHeight - 16;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth"
          });
        }
      };

      const selectDiscoverTab = (tab: "passions" | "politics" | "testimonials" | "compare" | "faq") => {
        window.dispatchEvent(new CustomEvent("simone_select_tab", { detail: { tab } }));
      };

      switch (digit) {
        case "1":
          e.preventDefault();
          scrollToSection("about");
          showShortcutToast("1", language === "it" ? "Mi presento" : "About me");
          break;
        case "2": {
          e.preventDefault();
          scrollToSection("esperienze");
          const nextFilter: TimelineFilter = timelineFilterRef.current === "work" ? "all" : "work";
          setTimelineFilter(nextFilter);
          window.dispatchEvent(new CustomEvent("simone_timeline_filter", { detail: { tab: nextFilter } }));
          showShortcutToast(
            "2",
            nextFilter === "work"
              ? (language === "it" ? "Esperienze • Lavoro" : "Experience • Work")
              : (language === "it" ? "Esperienze • Tutte le tappe" : "Experience • All stages")
          );
          break;
        }
        case "3": {
          e.preventDefault();
          scrollToSection("esperienze");
          const nextFilter: TimelineFilter = timelineFilterRef.current === "education" ? "all" : "education";
          setTimelineFilter(nextFilter);
          window.dispatchEvent(new CustomEvent("simone_timeline_filter", { detail: { tab: nextFilter } }));
          showShortcutToast(
            "3",
            nextFilter === "education"
              ? (language === "it" ? "Esperienze • Formazione" : "Experience • Education")
              : (language === "it" ? "Esperienze • Tutte le tappe" : "Experience • All stages")
          );
          break;
        }
        case "4":
          e.preventDefault();
          scrollToSection("lingue");
          showShortcutToast("4", language === "it" ? "Lingue" : "Languages");
          break;
        case "5":
          e.preventDefault();
          selectDiscoverTab("passions");
          showShortcutToast("5", language === "it" ? "Scopri di più • Passioni" : "Discover more • Passions");
          break;
        case "6":
          e.preventDefault();
          selectDiscoverTab("politics");
          showShortcutToast("6", language === "it" ? "Scopri di più • Opinioni politiche" : "Discover more • Political views");
          break;
        case "7":
          e.preventDefault();
          selectDiscoverTab("testimonials");
          showShortcutToast("7", language === "it" ? "Scopri di più • Dicono di me" : "Discover more • Testimonials");
          break;
        case "8":
          e.preventDefault();
          selectDiscoverTab("compare");
          showShortcutToast("8", language === "it" ? "Scopri di più • Confronta" : "Discover more • Compare");
          break;
        case "9":
          e.preventDefault();
          selectDiscoverTab("faq");
          showShortcutToast("9", language === "it" ? "Scopri di più • FAQ" : "Discover more • FAQ");
          break;
        case "0":
          e.preventDefault();
          scrollToSection("contatti");
          showShortcutToast("0", language === "it" ? "Contatti" : "Contact");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (shortcutToastTimerRef.current) clearTimeout(shortcutToastTimerRef.current);
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans relative selection:bg-rose-100 selection:text-rose-900 transition-colors duration-300 w-full max-w-full overflow-x-clip">
      {/* Navigation Header with Language Toggle and Night Mode */}
      <Navbar
        userName={profile.name}
        avatarUrl={profile.avatarUrl}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSelectLanguage={handleSelectLanguage}
        onOpenEdit={() => setIsEditOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Sections */}
      <main className="w-full max-w-full overflow-x-clip">
        {/* Landing Page: Breve descrizione su di me with 3D Flip Card Photo */}
        <LandingAbout
          profile={profile}
          language={language}
          onOpenEdit={() => setIsEditOpen(true)}
          onScrollToWork={scrollToWork}
          onAvatarChange={(newAv) => setCustomAvatar(newAv)}
        />

        {/* Lavoro e Formazione in una timeline orizzontale a ritroso negli anni */}
        <WorkAndEducationTimeline 
          workItems={workItems} 
          education={education} 
          language={language}
          filter={timelineFilter}
          onFilterChange={setTimelineFilter}
        />

        {/* Lingue (senza la parola 'sezione', con bandiere e 'Altro' invece di tedesco) */}
        <LanguagesSection languages={languages} language={language} />

        {/* Scopri di più (include Passioni, Opinioni politiche, Dicono di me, Confronta, FAQ) */}
        <DiscoverMoreSection 
          passions={passions} 
          politicalViews={politicalViews} 
          language={language} 
        />

        {/* Contatti (senza la parola 'sezione', con Flickr al posto di GitHub) */}
        <ContactSection profile={profile} language={language} />
      </main>

      {/* Keyboard Shortcut Toast Notification (no-print) */}
      <AnimatePresence>
        {shortcutToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 shadow-xl backdrop-blur-md border border-slate-700/40 dark:border-slate-200/80 no-print"
          >
            <span className="w-5 h-5 rounded-md bg-white/20 dark:bg-slate-900/15 flex items-center justify-center font-mono font-bold text-xs shrink-0">
              {shortcutToast.key}
            </span>
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
              {shortcutToast.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Dock: Scroll Top (no-print) */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30 flex flex-col items-end gap-2.5 no-print">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              title={language === "it" ? "Torna all'inizio" : "Back to top"}
              aria-label={language === "it" ? "Torna all'inizio" : "Back to top"}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-violet-600/95 hover:bg-violet-700 active:bg-violet-800 text-white flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-colors border border-violet-400/30 backdrop-blur-xs"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        language={language}
        onSave={handleSaveProfile}
        onReset={handleResetProfile}
      />
    </div>
  );
}
