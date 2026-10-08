import { useState, useRef } from "react";
import { LanguageItem, AppLanguage } from "../types";
import { uiTranslations } from "../data/placeholderData";
import { Globe2, Plus } from "lucide-react";

interface LanguagesSectionProps {
  languages: LanguageItem[];
  language: AppLanguage;
}

interface LanguageWhereSpoken {
  title: string;
  places: string[];
  note?: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
  bulletClass: string;
  hoverBorderClass: string;
}

export function LanguagesSection({ languages, language }: LanguagesSectionProps) {
  const t = uiTranslations[language];
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const autoFlipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getWhereSpokenData = (item: LanguageItem): LanguageWhereSpoken => {
    const langLower = item.language.toLowerCase();

    // Italiano -> Verde (Bandiera Italiana)
    if (langLower.includes("ital")) {
      return {
        title: language === "it" ? "Dove è parlato:" : "Where it's spoken:",
        places: language === "it" 
          ? ["Italia", "San Marino", "Vaticano", "Salerno"]
          : ["Italy", "San Marino", "Vatican", "Salerno"],
        bgClass: "bg-[#008c45]", // Verde bandiera italiana
        textClass: "text-white",
        badgeClass: "bg-white/20 text-white border-white/30",
        bulletClass: "bg-white text-[#008c45]",
        hoverBorderClass: "group-hover:border-[#008c45] hover:border-[#008c45]"
      };
    }

    // Spagnolo -> Giallo (Bandiera Spagnola)
    if (langLower.includes("spagnol") || langLower.includes("span")) {
      return {
        title: language === "it" ? "Dove è parlato:" : "Where it's spoken:",
        places: language === "it"
          ? ["Spagna", "Centro America", "Sud America", "Filippine", "Via Padova, Milano"]
          : ["Spain", "Central America", "South America", "Philippines", "Via Padova, Milan"],
        bgClass: "bg-[#ffc400]", // Giallo bandiera spagnola
        textClass: "text-slate-900",
        badgeClass: "bg-red-600 text-white font-bold border-red-700",
        bulletClass: "bg-red-600 text-white",
        hoverBorderClass: "group-hover:border-[#ffc400] hover:border-[#ffc400]"
      };
    }

    // Inglese -> Blu (Bandiera UK)
    if (langLower.includes("ingl") || langLower.includes("engl")) {
      return {
        title: language === "it" ? "Dove è parlato:" : "Where it's spoken:",
        places: language === "it" 
          ? [
              "Tutto il mondo", 
              "Non in Cina, non parlano una parola. Quando ci sono stato mi sono dovuto affidare completamente al traduttore e comunque non è bastato, sono dovuto ricorrere ad un rudimentale sistema di suoni e gesti."
            ] 
          : [
              "The entire world", 
              "Not in China, they don't speak a word. When I was there I had to completely rely on the translator and still it wasn't enough, I had to resort to a rudimentary system of sounds and gestures."
            ],
        bgClass: "bg-[#012169]", // Blu bandiera inglese
        textClass: "text-white",
        badgeClass: "bg-white/20 text-white border-white/30",
        bulletClass: "bg-white text-[#012169]",
        hoverBorderClass: "group-hover:border-[#012169] hover:border-[#012169]"
      };
    }

    // Altro -> Gira e rigira subito senza nulla dietro
    return {
      title: language === "it" ? "Dove è parlato:" : "Where it's spoken:",
      places: [],
      bgClass: "bg-slate-900",
      textClass: "text-white",
      badgeClass: "bg-white/20 text-white border-white/30",
      bulletClass: "bg-white text-slate-900",
      hoverBorderClass: "group-hover:border-slate-800 hover:border-slate-800 dark:group-hover:border-slate-600 dark:hover:border-slate-600"
    };
  };

  const handleCardClick = (item: LanguageItem) => {
    const isOther = item.id === "lang-4" || item.language.toLowerCase().includes("altr") || item.language.toLowerCase().includes("other");

    if (isOther) {
      // La scheda altro se cliccata si gira e si rigira subito
      if (autoFlipTimeoutRef.current) {
        clearTimeout(autoFlipTimeoutRef.current);
      }
      setFlippedCards((prev) => ({ ...prev, [item.id]: true }));
      autoFlipTimeoutRef.current = setTimeout(() => {
        setFlippedCards((prev) => ({ ...prev, [item.id]: false }));
      }, 400);
      return;
    }

    setFlippedCards((prev) => ({
      ...prev,
      [item.id]: !prev[item.id]
    }));
  };

  return (
    <section id="lingue" className="py-8 md:py-11 px-4 sm:px-6 bg-white dark:bg-[#0b0f19] border-b border-slate-200/80 dark:border-slate-800 transition-colors scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100/80 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center shrink-0 shadow-2xs">
              <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span>{t.sections.languages}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl">
            {t.sections.languagesSubtitle}
          </p>
        </div>

        {/* Language Grid with 3D Flip */}
        <div className="grid sm:grid-cols-2 gap-5">
          {languages.map((item) => {
            const isFlipped = !!flippedCards[item.id];
            const spokenData = getWhereSpokenData(item);
            const isOther = item.id === "lang-4" || item.language.toLowerCase().includes("altr") || item.language.toLowerCase().includes("other");

            return (
              <div
                key={item.id}
                className="relative min-h-[290px] h-full select-none"
                style={{ perspective: "1000px" }}
              >
                <div
                  onClick={() => handleCardClick(item)}
                  className="group w-full h-full min-h-[290px] relative transition-transform duration-600 ease-in-out cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                  title={language === "it" ? "Clicca per scoprire dove è parlato" : "Click to discover where it is spoken"}
                >
                  {/* FRONT FACE */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-3xl bg-slate-50/80 dark:bg-[#151c2c] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-2xs ${spokenData.hoverBorderClass} hover:shadow-xs transition-colors duration-200 flex flex-col justify-between`}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    }}
                  >
                    <div>
                      {/* Header: Flag + Language name + CEFR Badge */}
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl filter drop-shadow-2xs select-none" role="img" aria-label={item.language}>
                            {item.flag}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            {item.language}
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                          {item.cefr}
                        </span>
                      </div>

                      {/* Fluency level string */}
                      <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2.5">
                        {item.level}
                      </div>

                      {/* Fluency Bar with subtle gradient */}
                      <div className="mb-3.5">
                        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-400 font-medium mb-1.5">
                          <span>{t.languagesSection.fluency}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Prompt to Flip: Scopri di più with + icon */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === "it" ? "Scopri di più" : "Learn more"}</span>
                      </span>
                    </div>
                  </div>

                  {/* BACK FACE (Colorata con il colore della bandiera: Verde, Giallo, Blu. La scheda altro è vuota) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between ${spokenData.bgClass} ${spokenData.textClass} border-2 border-white/20 ${spokenData.hoverBorderClass} transition-colors duration-200`}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    {!isOther ? (
                      <>
                        <div>
                          {/* Back Header */}
                          <div className="flex items-center justify-between gap-3 mb-3 border-b border-current/20 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl filter drop-shadow-xs" role="img" aria-label={item.language}>
                                {item.flag}
                              </span>
                              <div>
                                <h4 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                                  {item.language}
                                </h4>
                                <span className="text-[11px] font-semibold opacity-90">
                                  {spokenData.title}
                                </span>
                              </div>
                            </div>

                            {/* Question mark emoji in place of flag (white question mark on Spanish card) */}
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${spokenData.badgeClass}`}>
                                {item.id === "lang-3" || item.language.toLowerCase().includes("spagnol") || item.language.toLowerCase().includes("span") ? "❔" : "❓"}
                              </span>
                            </div>
                          </div>

                          {/* Places List */}
                          <div className="space-y-2">
                            {spokenData.places.map((place, pIdx) => (
                              <div
                                key={pIdx}
                                className="flex items-start gap-2 text-xs sm:text-sm font-semibold tracking-tight leading-snug"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${spokenData.bulletClass}`} />
                                <span>{place}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Back Footer button: Scopri di più with + */}
                        <div className="mt-3 pt-2 border-t border-current/20 flex items-center justify-between text-[11px] font-semibold opacity-90">
                          <span className="inline-flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            <span>{language === "it" ? "Scopri di più" : "Learn more"}</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Altro: completely blank back face */
                      <div className="w-full h-full flex items-center justify-center" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
