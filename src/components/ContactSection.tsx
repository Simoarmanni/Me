import { useState, FormEvent } from "react";
import { UserProfile, AppLanguage } from "../types";
import { uiTranslations } from "../data/placeholderData";
import { 
  Mail, 
  Send, 
  Check, 
  Copy, 
  Linkedin, 
  MessageCircle
} from "lucide-react";

interface ContactSectionProps {
  profile: UserProfile;
  language: AppLanguage;
}

export function ContactSection({ profile, language }: ContactSectionProps) {
  const t = uiTranslations[language];
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string>("");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    const recipient = profile.email || "simoarmanni@gmail.com";
    const subject = formData.subject.trim()
      ? formData.subject.trim()
      : (language === "it" ? "Messaggio dal portfolio" : "Message from portfolio");

    const bodyContent = formData.message.trim();

    const url = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

    setMailtoHref(url);
    setFormSubmitted(true);

    // Automatically open user's default mail client
    window.location.href = url;
  };

  return (
    <section id="contatti" className="py-8 md:py-11 px-4 sm:px-6 bg-white dark:bg-[#0b0f19] border-t border-slate-200/80 dark:border-slate-800 transition-colors scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-100/80 dark:border-violet-900/50 text-violet-600 dark:text-violet-400 inline-flex items-center justify-center shrink-0 shadow-2xs">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span>{t.sections.contact}</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-none">
            {t.sections.contactSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info and Availability */}
          <div className="md:col-span-5 space-y-4">
            {/* Email Card with 1-click Copy */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#151c2c] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Email</span>
                <button
                  onClick={() => handleCopy(profile.email, "email")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === "email" ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {t.contact.copied}
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> {t.contact.copy}
                    </>
                  )}
                </button>
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block break-all font-mono"
              >
                {profile.email}
              </a>
            </div>

            {/* Social Profiles Card with 2 Big Prominent Half-Card Buttons */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#151c2c] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-3">
                {t.contact.socialProfiles}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* LinkedIn Button - Half of card, icon side-by-side with name, no subtitle */}
                <a
                  href={profile.linkedin || "https://www.linkedin.com/in/simone-armanni"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[52px] px-3.5 sm:px-4 py-3 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 group cursor-pointer active:scale-98"
                  title="LinkedIn"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-blue-100 dark:border-blue-800/60 shadow-2xs">
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                    LinkedIn
                  </span>
                </a>

                {/* Flickr Button - Half of card, logo side-by-side with name, no subtitle */}
                <a
                  href={profile.flickr || "https://www.flickr.com/people/simoarmanni/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[52px] px-3.5 sm:px-4 py-3 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-pink-50/70 dark:hover:bg-pink-950/40 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 group cursor-pointer active:scale-98"
                  title="Flickr"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-50 dark:bg-slate-700/60 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-slate-200/80 dark:border-slate-600 shadow-2xs">
                    {/* Official Flickr logo: Blue and Magenta dots */}
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0063dc] inline-block group-hover:scale-110 transition-transform" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff0084] inline-block group-hover:scale-110 transition-transform" />
                    </span>
                  </div>
                  <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-[#ff0084] dark:group-hover:text-pink-400 transition-colors whitespace-nowrap">
                    Flickr
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="md:col-span-7">
            <div className="rounded-3xl bg-slate-50/80 dark:bg-[#151c2c] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors p-6 sm:p-8 card-print">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-5">
                {t.contact.sendMessage}
              </h3>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    {language === "it" ? "Client email aperto!" : "Email client opened!"}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed max-w-sm mx-auto">
                    {language === "it"
                      ? "Il tuo programma di posta elettronica è stato avviato con i campi già precompilati. Se non si è aperto automaticamente, puoi aprirlo dal pulsante qui sotto:"
                      : "Your email program has been triggered with the fields already prefilled. If it didn't open automatically, you can open it with the button below:"}
                  </p>
                  {mailtoHref && (
                    <div className="pt-1">
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{language === "it" ? "Apri programma di posta" : "Open email app"}</span>
                      </a>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ subject: "", message: "" });
                        setMailtoHref("");
                      }}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer pt-2"
                    >
                      {t.contact.sendAnother}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.contact.subject}
                    </label>
                    <input
                      type="text"
                      placeholder={(t.contact as unknown as { placeholderSubject?: string }).placeholderSubject || (language === "it" ? "es. Opportunità di collaborazione / Colloquio" : "e.g. Collaboration opportunity / Interview")}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.contact.message} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={(t.contact as unknown as { placeholderMessage?: string }).placeholderMessage || (language === "it" ? "Raccontami brevemente di cosa si tratta..." : "Tell me briefly what this is about...")}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.sendButton}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-1.5">
          <div className="font-medium text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {profile.name} — {t.footer.rights}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            {t.footer.aiNotice || "Questo sito è stato fatto con l'aiuto dell'IA, ma i testi e le idee sono farina del mio sacco :)"}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 italic">
            {t.footer.noRefund || "Nessun rimborso in caso di assunzione"}
          </div>
        </div>
      </div>
    </section>
  );
}
