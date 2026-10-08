import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppLanguage } from "../types";
import { uiTranslations } from "../data/placeholderData";
import { Menu, X, Lightbulb } from "lucide-react";

interface NavbarProps {
  userName: string;
  avatarUrl?: string;
  language: AppLanguage;
  onToggleLanguage: () => void;
  onSelectLanguage: (lang: AppLanguage) => void;
  onOpenEdit?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Navbar({
  userName,
  avatarUrl,
  language,
  onSelectLanguage,
  isDarkMode = false,
  onToggleDarkMode,
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = uiTranslations[language];

  // Close mobile menu when clicking outside or scrolling outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const header = document.getElementById("main-navbar");
      if (header && !header.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleWindowScroll = () => {
      setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleDocumentClick);
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);

          const sections = ["about", "esperienze", "lingue", "scopri-di-piu", "contatti"];
          const current = sections.find((sec) => {
            const el = document.getElementById(sec);
            if (el) {
              const rect = el.getBoundingClientRect();
              return rect.top <= 180 && rect.bottom >= 180;
            }
            return false;
          });
          if (current) {
            setActiveSection(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "esperienze", label: language === "it" ? "Esperienze" : "Experience" },
    { id: "lingue", label: t.nav.languages },
    { id: "scopri-di-piu", label: t.nav.discoverMore || (language === "it" ? "Scopri di più" : "Discover more") },
    { id: "contatti", label: t.nav.contact },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === "esperienze" || id === "lavoro") {
      window.dispatchEvent(new CustomEvent("simone_timeline_filter", { detail: { tab: "all" } }));
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const nav = document.getElementById("main-navbar");
        const navHeight = nav ? nav.offsetHeight : 64;
        const elRect = el.getBoundingClientRect();
        const targetY = window.pageYOffset + elRect.top - navHeight - 12;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: "smooth"
        });
      }
    }, 60);
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200 no-print bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs py-2.5 sm:py-3"
    >
      <div className="relative z-40 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand / Name Tag */}
        <button
          id="nav-brand-btn"
          onClick={() => scrollTo("about")}
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-blue-600 via-violet-600 to-indigo-600 shadow-xs transition-transform group-hover:scale-105 shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".avatar-fallback");
                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                }}
                className="w-full h-full object-cover rounded-full bg-slate-100 dark:bg-slate-800"
              />
            ) : null}
            <div 
              className={`avatar-fallback w-full h-full bg-slate-900 dark:bg-indigo-900 rounded-full flex items-center justify-center ${avatarUrl ? "hidden" : "flex"}`}
            >
              <span className="text-[10px] sm:text-xs font-bold text-white">
                {initials || "SA"}
              </span>
            </div>
          </div>
          <div>
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-slate-900 dark:text-slate-100 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {userName}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/80 shadow-xs overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => scrollTo(item.id)}
                className={`px-2.5 lg:px-3 py-1.5 rounded-full text-[11px] lg:text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Language Toggle + Night Mode Toggle + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Pill */}
          <div
            id="nav-language-toggle"
            className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-2xs"
            title={language === "it" ? "Lingua attiva: Italiano. Clicca per cambiare in Inglese." : "Active language: English. Click to switch to Italian."}
          >
            <button
              onClick={() => onSelectLanguage("it")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                language === "it"
                  ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>🇮🇹</span>
              <span className="hidden sm:inline">IT</span>
            </button>
            <button
              onClick={() => onSelectLanguage("en")}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                language === "en"
                  ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>

          {/* Night Mode Toggle Button with Lightbulb icon */}
          <button
            id="nav-night-mode-toggle"
            type="button"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? (language === "it" ? "Disattiva modalità notte" : "Turn off night mode") : (language === "it" ? "Attiva modalità notte" : "Turn on night mode")}
            title={isDarkMode ? (language === "it" ? "Disattiva modalità notte" : "Turn off night mode") : (language === "it" ? "Attiva modalità notte" : "Turn on night mode")}
            className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center select-none touch-manipulation ${
              isDarkMode
                ? "bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-xs hover:bg-amber-400/30 active:scale-95"
                : "bg-slate-100/90 hover:bg-slate-200/90 text-slate-600 border-slate-200/80 shadow-2xs hover:text-amber-600 active:scale-95"
            }`}
          >
            <Lightbulb className={`w-4 h-4 transition-transform ${isDarkMode ? "fill-amber-300 text-amber-300 rotate-12" : "text-slate-600"}`} />
          </button>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              id="nav-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 cursor-pointer touch-manipulation"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer - Positioned at z-40 strictly ABOVE the backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative z-40 md:hidden overflow-hidden max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-3 border-t border-slate-200 dark:border-slate-800 mt-2.5 bg-white dark:bg-[#0f172a] rounded-b-2xl shadow-2xl"
          >
            {/* Nav items list */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`min-h-[46px] py-2.5 px-3.5 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer select-none touch-manipulation flex items-center active:scale-[0.98] ${
                    activeSection === item.id
                      ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800"
                      : "text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop Overlay - Positioned at z-20 (BEHIND the drawer and nav bar) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMobileMenuOpen(false)}
            onTouchStart={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-0 h-screen w-screen bg-black/40 z-20 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </header>
  );
}
