import { 
  UserProfile, 
  WorkItem, 
  EducationItem, 
  LanguageItem, 
  PassionItem, 
  PoliticalViewItem 
} from "../types";

// ==========================================
// ITALIAN DATA (IT) - SIMONE ARMANNI
// ==========================================

export const initialProfileIT: UserProfile = {
  name: "Simone Armanni",
  role: "Specialista in Comunicazione e Produzione di Contenuti",
  tagline: "Amo lavorare, lo giuro",
  shortBio: "Per un breve periodo della mia vita la mia casella mail era diventata inutilizzabile per via dell'ammucchiarsi di tutte le offerte di lavoro che mi arrivavano giorno dopo giorno, senza nemmeno averle cercate. Preoccupato che la cosa potesse andare avanti a lungo, ho deciso di chiudere con l'informatica e di specializzarmi in un ambito nel quale sapevo che non avrei mai corso un tale rischio: la comunicazione.",
  extendedBio: [
    "Finitoci per caso, devo ammettere mi ci sono subito appassionato. Ho presto scoperto che la comunicazione può essere molto di più che fare storie su instagram ed ingannare un manipolo di consumatori disattenti, ma se fatta bene può essere anche fare post su tiktok e ingannare un manipolo di consumatori attenti.",
    "Su di me come persona invece, navigare questo sito vi dirà molto di più di qualsiasi testo stringato possa dirvi. La comunicazione in fondo è anche questo, non dire ma lasciar intendere."
  ],
  location: "Melzo (MI), Italia",
  status: "Aperto a nuove opportunità",
  email: "simoarmanni@gmail.com",
  phone: "",
  website: "https://simonearmanni.com",
  flickr: "https://www.flickr.com/people/simoarmanni/",
  linkedin: "https://www.linkedin.com/in/simone-armanni",
  avatarUrl: "./Media/Simone.jpg",
  stats: [
    { value: "3+ anni", label: "Di esperienza", sublabel: "nell'ambito media" },
    { value: "110L", label: "Laurea magistrale", sublabel: "in comunicazione" },
    { value: "500+ ore", label: "Nella ricerca di un lavoro", sublabel: "tempo ben speso" },
    { value: "3", label: "Lingue parlate", sublabel: "IT (C2), EN (C1), ES (A2)" }
  ],
  keySkills: [
    "Adobe Creative Suite",
    "Final Cut Pro",
    "Video Editing",
    "Montaggio",
    "Fotografia",
    "Visual Storytelling",
    "Photo editing",
    "Copywriting",
    "Content Strategy",
    "Comunicazione digitale",
    "Media planning",
    "Microsoft Office 365",
    "SharePoint"
  ],
  softSkills: [
    "Adattabilità",
    "Pensiero laterale",
    "Creatività",
    "Gestione del tempo",
    "Attenzione ai dettagli"
  ]
};

export const initialWorkExperienceIT: WorkItem[] = [
  {
    id: "work-1",
    role: "Media Production and Assistance",
    company: "Plantar Uma Arvore",
    location: "Lisbona, Portogallo",
    period: "2026",
    current: false,
    type: "Collaborazione",
    description: "Attività operativa sul campo, produzione e montaggio video, creazione di contenuti multimediali e copertura fotografica per documentare e valorizzare le iniziative ambientali della ONG a Lisbona.",
    achievements: [
      "Pianificazione e realizzazione di contenuti audiovisivi sul campo per documentare le iniziative e sensibilizzare la community.",
      "Cura di riprese e fotografia di eventi, valorizzando l'impatto sociale ed ecologico dei progetti.",
      "Gestione del flusso completo di montaggio video e post-produzione grafica con standard qualitativi elevati."
    ],
    technologies: ["Video Editing", "Photography", "Final Cut Pro", "Content Creation", "Field Assistance"],
    accentColor: "from-emerald-500/15 to-teal-500/15"
  },
  {
    id: "work-2",
    role: "Internal Communication Specialist",
    company: "STMicroelectronics",
    location: "Agrate Brianza (MB), Italia",
    period: "2025 — 2026",
    current: false,
    type: "Tempo pieno",
    description: "Gestione strategica e operativa della comunicazione interna per la multinazionale: campagne cross-mediali, content strategy, amministrazione SharePoint, produzione video e monitoraggio KPI nel rispetto delle brand guidelines.",
    achievements: [
      "Ideazione e implementazione di campagne di comunicazione cross-mediali per favorire l'allineamento dei team e la cultura aziendale.",
      "Gestione e ottimizzazione dei contenuti del portale SharePoint aziendale, migliorando l'accessibilità delle informazioni.",
      "Produzione di video istituzionali e interviste interne con conformità alle linee guida globali di brand.",
      "Monitoraggio costante dei KPI di visualizzazione e gradimento per ottimizzare le future strategie editoriali."
    ],
    technologies: ["Internal Communication", "SharePoint", "Content Strategy", "Video Production", "PlayPlay", "Microsoft Publisher", "Organizzazione Eventi", "KPI Tracking", "Brand Guidelines"],
    accentColor: "from-indigo-500/15 to-blue-500/15"
  },
  {
    id: "work-3",
    role: "Marketing e Comunicazione",
    company: "OD Più S.p.A.",
    location: "Tribiano (MI), Italia",
    period: "2024",
    current: false,
    type: "Tempo pieno",
    description: "Attività a 360° tra analisi di mercato e benchmarking, comunicazione aziendale interna ed esterna, graphic design, copywriting promozionale e coordinamento dell'organizzazione logistica per eventi istituzionali.",
    achievements: [
      "Conduzione di analisi di mercato e benchmarking competitivo a supporto del posizionamento commerciale.",
      "Progettazione di materiali di graphic design e copy accattivanti per canali cartacei e digitali.",
      "Pianificazione e coordinamento dell'organizzazione logistica e promozionale di eventi aziendali."
    ],
    technologies: ["Marketing Analysis", "Graphic Design", "Copywriting", "Organizzazione Eventi", "Adobe InDesign", "Excel", "Mailing List"],
    accentColor: "from-rose-500/15 to-orange-500/15"
  },
  {
    id: "work-4",
    role: "Ufficio Stampa e Supporto",
    company: "BookCity Milano",
    location: "Milano (MI), Italia",
    period: "2023",
    current: false,
    type: "Evento culturale",
    description: "Supporto alle attività dell'ufficio stampa della più importante manifestazione culturale milanese dedicata al libro: redazione post per i canali social media, assistenza sul campo durante gli eventi e public engagement.",
    achievements: [
      "Redazione di comunicati stampa e post social tempestivi per la copertura live degli appuntamenti letterari.",
      "Assistenza operativa ad autori, giornalisti e relatori durante gli incontri sul territorio.",
      "Coinvolgimento attivo del pubblico attraverso una narrazione fresca, empatica e puntuale."
    ],
    technologies: ["Ufficio Stampa", "Social Media", "Copywriting", "Public Engagement", "Logistica Eventi", "PR"],
    accentColor: "from-amber-500/15 to-rose-500/15"
  }
];

export const initialEducationIT: EducationItem[] = [
  {
    id: "edu-1",
    degree: "Percorso di Formazione in Leadership e Management",
    institution: "Confindustria - D20 Leader",
    location: "Italia",
    period: "2024",
    description: "Programma selettivo di alta formazione incentrato sullo sviluppo di leadership, pensiero laterale, problem solving complesso, gestione strategica delle persone e dinamiche decisionali manageriali moderne.",
    skillsAcquired: [
      "Leadership",
      "People Management",
      "Public Speaking",
      "Pensiero Laterale",
      "Problem Solving",
      "Gestione del Tempo",
      "Decision Making Strategico"
    ]
  },
  {
    id: "edu-2",
    degree: "Laurea Magistrale in Comunicazione d'Impresa e Relazioni Pubbliche",
    institution: "Università degli Studi di Milano",
    location: "Milano, Italia",
    period: "2022 — 2024",
    grade: "110L/110",
    description: "Specializzazione avanzata sulle strategie di comunicazione d'impresa, reputazione aziendale, relazioni pubbliche, media planning integrato, gestione della comunicazione di crisi e storytelling transmediale.",
    skillsAcquired: [
      "Comunicazione d'Impresa",
      "PR",
      "Media Planning",
      "Brand Strategy",
      "Storytelling",
      "Reputazione",
      "Ricerca Qualitativa",
      "Ricerca Quantitativa"
    ]
  },
  {
    id: "edu-3",
    degree: "Laurea Triennale in Comunicazione e Società",
    institution: "Università degli Studi di Milano",
    location: "Milano, Italia",
    period: "2019 — 2022",
    grade: "103/110",
    description: "Formazione multidisciplinare sui processi comunicativi contemporanei, sociologia dei media digitali, semiotica della cultura, linguistica applicata, teorie dei linguaggi e metodi qualitativi di ricerca sociale.",
    skillsAcquired: [
      "Sociologia dei Media",
      "Nuove Tecnologie",
      "Semiotica",
      "Linguistica",
      "Linguistica Applicata",
      "Ricerca Sociale",
      "Analisi Dati",
      "Statistica"
    ]
  },
  {
    id: "edu-4",
    degree: "Diploma di Istituto Tecnico - Indirizzo Informatica",
    institution: "Istituto Tecnico Industriale Guglielmo Marconi",
    location: "Gorgonzola (MI), Italia",
    period: "2013 — 2018",
    grade: "76/100",
    description: "Percorso formativo incentrato sui fondamenti di sviluppo software, logica algoritmica, database e infrastrutture di rete: un bagaglio metodologico che ha posto le basi logiche per il percorso digitale e multimediale.",
    skillsAcquired: [
      "Informatica",
      "Programmazione",
      "Sistemi",
      "Reti",
      "Cybersecurity",
      "Intelligenza Artificiale",
      "Elettronica"
    ]
  }
];

export const initialLanguagesIT: LanguageItem[] = [
  {
    id: "lang-1",
    language: "Italiano",
    flag: "🇮🇹",
    level: "Madrelingua",
    cefr: "C2",
    percentage: 100,
    description: "La lingua di Dante, Boccaccio, Manzoni, Calvino, e ora di Simone. Piena padronanza per la redazione di testi, conduzione di eventi, comunicati, e copywriting, senza alcun accenno di dislessia.",
    usageContext: [
      "Copywriting e Storytelling aziendale",
      "Redazione comunicati stampa e articoli",
      "Presentazioni e public speaking"
    ],
    color: "from-rose-500 to-pink-500"
  },
  {
    id: "lang-2",
    language: "Inglese",
    flag: "🇬🇧",
    level: "Avanzato Professionale",
    cefr: "C1",
    percentage: 90,
    description: "Competenza avanzata nella comprensione e produzione scritta e orale, idonea a contesti multinazionali, e coordinamento con team esteri. L'accento potrebbe essere leggermente italianeggiante.",
    usageContext: [
      "Comunicazione in contesti multinazionali",
      "Stesura di report e presentazioni in lingua",
      "Interviste e incontri con partner esteri"
    ],
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "lang-3",
    language: "Spagnolo",
    flag: "🇪🇸",
    level: "Livello Elementare",
    cefr: "A2",
    percentage: 30,
    description: "Nozioni di base, vocabolario elementare, e comprensione di testi semplici. Meno male che è quasi uguale all'italiano.",
    usageContext: [
      "Interazioni elementari",
      "Vocabolario di base",
      "Comprensione iniziale"
    ],
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "lang-4",
    language: "Altro",
    flag: "🌐",
    level: "Apprendimento Rapido",
    cefr: "Fast Learner",
    percentage: 100,
    description: "Cinese, arabo, tedesco, russo, e persino bergamasco. Se serve posso imparare qualsiasi nuova lingua, basta che abbiate un po' di pazienza.",
    usageContext: [
      "Disponibilità immediata allo studio",
      "Corsi aziendali o intensivi pre-relocation",
      "Apertura a progetti internazionali"
    ],
    color: "from-emerald-500 to-teal-500"
  }
];

export const initialPassionsIT: PassionItem[] = [
  {
    id: "pas-1",
    title: "Fotografia e Racconto Visivo",
    category: "Arti Visive e Luce",
    description: "La passione per la fotografia è relativamente recente, e per essa ho dovuto imparare da zero un nuovo modo di raccontare storie, fatto di luci, ombre, contrasti, colori, e tanta pazienza. Non sono ancora un professionista, ma la fotografia mi ha giù restituito una grande gratificazione.",
    iconName: "Camera",
    tags: ["Fotografia", "Composizione Visiva", "Storytelling", "Lightroom"],
    accentColor: "from-rose-500/10 via-pink-500/10 to-violet-500/10"
  },
  {
    id: "pas-2",
    title: "Scrittura e Copywriting Narrativo",
    category: "Letteratura e Scrittura",
    description: "Mi piace scrivere e, detto fuor di modestia, sono piuttosto bravo nel farlo. Scrivo per lo più riflessioni, brevi saggi, e racconti umoristici. La mia opera più impegnativa finora è \"Il Mercante\", una rivista satirica di circa cinquanta pagine che ho ideato, scritto, disegnato, impaginato, e persino stampato solo per amor della scrittura.",
    iconName: "Type",
    tags: ["Scrittura Creativa", "Copywriting", "Saggistica", "Microcopy"],
    accentColor: "from-indigo-500/10 via-violet-500/10 to-blue-500/10"
  },
  {
    id: "pas-video",
    title: "Video e cortometraggi",
    category: "Produzione Audiovisiva",
    description: "Ammetto che è la passione che porto avanti con minore frequenza, ma d'altronde è quella che richiede più tempo e spesso anche più mezzi. Purtroppo non posso condividere molti dei video che ho realizzato perché mi precluderei immediatamente qualsiasi assunzione, ma uno sì dai.",
    iconName: "Video",
    tags: ["Video Editing", "Short Films", "Storytelling", "YouTube"],
    accentColor: "from-violet-500/10 via-purple-500/10 to-indigo-500/10"
  },
  {
    id: "pas-3",
    title: "Test attitudinali",
    category: "Introspezione e Sfide",
    description: "Non riesco ad averne mai abbastanza! A volte mi candido a delle offerte di lavoro solo per il piacere di fare un buon test attitudinale, e ad ogni test cerco di battere il mio miglior tempo di compilazione. In linea di massima le domande si somigliano un po' tutte, per cui di solito procedo spedito, ma amo quando la sfida si fa dura con domande scomode e personali che richiedono una grande capacità introspettiva, e mi vedo costretto a fermarmi per qualche minuto a riflettere. Mi fa sentire come se qualcuno davvero leggesse le mie risposte.",
    iconName: "ClipboardCheck",
    tags: [],
    accentColor: "from-amber-500/10 via-orange-500/10 to-yellow-500/10"
  }
];

export const initialPoliticalViewsIT: PoliticalViewItem[] = [
  {
    id: "pol-1",
    topic: "Tirocini e Stage",
    stance: "I tirocini rendono stimolante il proprio lavoro, incentivando un processo di miglioramento continuo che si rinnova di sei mesi in sei mesi, mentre con un contratto a tempo indeterminato i lavoratori si adagiano sugli allori e non acquisiscono nuove competenze. Sono quindi un ottimo strumento per aumentare la produttività che non verrà mai e poi mai abusato, ed anzi, dovrebbero essere resi obbligatori per legge.",
    description: "I tirocini rendono stimolante il proprio lavoro, incentivando un processo di miglioramento continuo che si rinnova di sei mesi in sei mesi, mentre con un contratto a tempo indeterminato i lavoratori si adagiano sugli allori e non acquisiscono nuove competenze. Sono quindi un ottimo strumento per aumentare la produttività che non verrà mai e poi mai abusato, ed anzi, dovrebbero essere resi obbligatori per legge.",
    badge: "Formazione"
  },
  {
    id: "pol-2",
    topic: "Intelligenza artificiale",
    stance: "L'uso dell'Intelligenza Artificiale per vagliare i curricula e scartare in maniera automatizzata centinaia di candidati disperati è il giusto prezzo da pagare per far lavorare dieci minuti di meno le risorse umane, vero motore della nostra società.",
    description: "L'uso dell'Intelligenza Artificiale per vagliare i curricula e scartare in maniera automatizzata centinaia di candidati disperati è il giusto prezzo da pagare per far lavorare dieci minuti di meno le risorse umane, vero motore della nostra società.",
    badge: "Tecnologia"
  },
  {
    id: "pol-3",
    topic: "LinkedIn",
    stance: "Prima di LinkedIn trovare un lavoro era impossibile, ora invece è facilissimo. Farsi assumere è rimasto difficile e probabilmente anche più di prima, ma almeno puoi fare i giochi della settimana mentre rimani disoccupato, che è comunque un passo avanti.",
    description: "Prima di LinkedIn trovare un lavoro era impossibile, ora invece è facilissimo. Farsi assumere è rimasto difficile e probabilmente anche più di prima, ma almeno puoi fare i giochi della settimana mentre rimani disoccupato, che è comunque un passo avanti.",
    badge: "Social Network"
  },
  {
    id: "pol-4",
    topic: "La comunicazione oggi",
    stance: "La comunicazione è la più grande risorsa dei nostri tempi. Amo le pubblicità e passerei le ore a guardarle, non riesco a capire chi usa gli adblock o viene infastidito da cartelloni pubblicitari gargantueschi che coprono le facciate delle cattedrali. Inoltre non bisogna dimenticare il ruolo fondamentale giocato dagli influencer digitali, pastori che indicano la via in un mondo di pecore. Spero che un giorno i miei figli saranno influencer.",
    description: "La comunicazione è la più grande risorsa dei nostri tempi. Amo le pubblicità e passerei le ore a guardarle, non riesco a capire chi usa gli adblock o viene infastidito da cartelloni pubblicitari gargantueschi che coprono le facciate delle cattedrali. Inoltre non bisogna dimenticare il ruolo fondamentale giocato dagli influencer digitali, pastori che indicano la via in un mondo di pecore. Spero che un giorno i miei figli saranno influencer.",
    badge: "Media"
  },
  {
    id: "pol-5",
    topic: "L'inglese",
    stance: "Ogni *business* al passo coi tempi dovrebbe *schedulare* un *onboarding* per fare *alignment* col proprio *team* sull'utilizzo dell'inglese nelle comunicazioni *corporate*. Parlare inglese non è solo una *mission* da mettere in una *roadmap* senza nessuna *deadline*, ma è una *skill* indispensabile per comunicare coi propri *stakeholder*. Occorre quindi che vengano implementati dei *benchmark* per misurare i *kpi* relativi all'utilizzo dell'inglese nei *touchpoint* del proprio *core business*, perché più inglese è più bello.",
    description: "Ogni business al passo coi tempi dovrebbe schedulare un onboarding per fare alignment col proprio team sull'utilizzo dell'inglese nelle comunicazioni corporate.",
    badge: "Linguaggio"
  }
];

// ==========================================
// ENGLISH DATA (EN) - SIMONE ARMANNI
// ==========================================

export const initialProfileEN: UserProfile = {
  name: "Simone Armanni",
  role: "Communication and Content Production Specialist",
  tagline: "I love working, I swear",
  shortBio: "For a brief period in my life, my email inbox became unusable due to the sheer pile-up of job offers landing in it day after day, without me even looking for them. Worried that this might drag on for too long, I decided to pull the plug on computer science and specialize in a field where I knew I'd never run such a risk: communication.",
  extendedBio: [
    "Having stumbled into it by accident, I must admit I was instantly hooked. I soon discovered that communication can be far more than just posting Instagram stories to deceive a handful of absent-minded consumers—done right, it can also mean making TikTok posts to deceive a handful of attentive consumers.",
    "As for who I am as a person, exploring this site will tell you far more than any brief text ever could. After all, that's what communication is all about: not stating things outright, but letting them be understood."
  ],
  location: "Melzo (Milan), Italy",
  status: "Open to new opportunities",
  email: "simoarmanni@gmail.com",
  phone: "",
  website: "https://simonearmanni.com",
  flickr: "https://www.flickr.com/people/simoarmanni/",
  linkedin: "https://www.linkedin.com/in/simone-armanni",
  avatarUrl: "./Media/Simone.jpg",
  stats: [
    { value: "3+ yrs", label: "Of experience", sublabel: "in the media field" },
    { value: "110L", label: "Master's degree", sublabel: "in communication" },
    { value: "500+ hrs", label: "Searching for a job", sublabel: "time well spent" },
    { value: "3", label: "Languages spoken", sublabel: "IT (C2), EN (C1), ES (A2)" }
  ],
  keySkills: [
    "Adobe Creative Suite",
    "Final Cut Pro",
    "Video Editing",
    "Video Assembly",
    "Photography",
    "Visual Storytelling",
    "Photo editing",
    "Copywriting",
    "Content Strategy",
    "Digital Communication",
    "Media Planning",
    "Microsoft Office 365",
    "SharePoint"
  ],
  softSkills: [
    "Adaptability",
    "Lateral thinking",
    "Creativity",
    "Time management",
    "Attention to detail"
  ]
};

export const initialWorkExperienceEN: WorkItem[] = [
  {
    id: "work-1",
    role: "Media Production and Assistance",
    company: "Plantar Uma Arvore",
    location: "Lisbon, Portugal",
    period: "2026",
    current: false,
    type: "Collaboration",
    description: "Field operations and logistical support, video production and editing, multimedia content creation, and event photography documenting and promoting the environmental initiatives of the Lisbon NGO.",
    achievements: [
      "Planning and production of on-site audiovisual content to document initiatives and raise community awareness.",
      "Event photography and videography, spotlighting ecological and social impact.",
      "Management of the end-to-end video post-production and digital graphics workflow to high editorial standards."
    ],
    technologies: ["Video Editing", "Photography", "Final Cut Pro", "Content Creation", "Field Assistance"],
    accentColor: "from-emerald-500/15 to-teal-500/15"
  },
  {
    id: "work-2",
    role: "Internal Communication Specialist",
    company: "STMicroelectronics",
    location: "Agrate Brianza (MB), Italy",
    period: "2025 — 2026",
    current: false,
    type: "Full-Time",
    description: "Strategic and operational internal communications for the multinational: cross-media campaigns, content strategy, SharePoint administration, video production, and KPI tracking in compliance with brand guidelines.",
    achievements: [
      "Conception and execution of cross-media communication campaigns fostering team alignment and corporate culture.",
      "Administration and refinement of enterprise SharePoint intranets, optimizing organizational access to key information.",
      "Production of corporate videos and internal spotlight interviews aligned with global brand guidelines.",
      "Continuous monitoring of viewership and engagement KPIs to iteratively enhance content reach and impact."
    ],
    technologies: ["Internal Communication", "SharePoint", "Content Strategy", "Video Production", "PlayPlay", "Microsoft Publisher", "Event Organization", "KPI Tracking", "Brand Guidelines"],
    accentColor: "from-indigo-500/15 to-blue-500/15"
  },
  {
    id: "work-3",
    role: "Marketing and Communication",
    company: "OD Più S.p.A.",
    location: "Tribiano (MI), Italy",
    period: "2024",
    current: false,
    type: "Full-Time",
    description: "360° scope encompassing market analysis and benchmarking, internal and external communications, graphic design, persuasive copywriting, and logistical coordination for corporate and promotional events.",
    achievements: [
      "Conducting market analyses and competitive benchmarking to inform commercial positioning.",
      "Creation of visually striking graphic design assets and compelling copywriting for print and digital channels.",
      "Planning and coordination of logistical execution and promotional rollouts for corporate events."
    ],
    technologies: ["Marketing Analysis", "Graphic Design", "Copywriting", "Event Organization", "Adobe InDesign", "Excel", "Mailing List"],
    accentColor: "from-rose-500/15 to-orange-500/15"
  },
  {
    id: "work-4",
    role: "Press Officer and Support",
    company: "BookCity Milano",
    location: "Milan (MI), Italy",
    period: "2023",
    current: false,
    type: "Cultural Event",
    description: "Press office support for Milan's premier literary festival: social media content creation, on-site assistance for authors and media during panels, and active cultural public engagement across the city.",
    achievements: [
      "Drafting press releases and real-time social media posts capturing high-profile literary events.",
      "Operational assistance to authors, journalists, and keynote speakers during festival panels across the city.",
      "Fostering community participation through empathetic storytelling and dynamic live coverage."
    ],
    technologies: ["Press Office", "Social Media", "Copywriting", "Public Engagement", "Event Logistics", "PR"],
    accentColor: "from-amber-500/15 to-rose-500/15"
  }
];

export const initialEducationEN: EducationItem[] = [
  {
    id: "edu-1",
    degree: "Training Program in Leadership and Management",
    institution: "Confindustria - D20 Leader",
    location: "Italy",
    period: "2024",
    description: "Selective executive training program focused on modern leadership development, lateral thinking, complex problem solving, strategic people management, and contemporary organizational decision-making.",
    skillsAcquired: [
      "Leadership",
      "People Management",
      "Public Speaking",
      "Lateral Thinking",
      "Problem Solving",
      "Time Management",
      "Strategic Decision Making"
    ]
  },
  {
    id: "edu-2",
    degree: "Master's Degree in Corporate Communication and Public Relations",
    institution: "University of Milan",
    location: "Milan, Italy",
    period: "2022 — 2024",
    grade: "110L/110",
    description: "Advanced specialization in corporate communication strategy, organizational reputation, public relations, integrated media planning, crisis communication management, and transmedia storytelling.",
    skillsAcquired: [
      "Corporate Communication",
      "PR",
      "Media Planning",
      "Brand Strategy",
      "Storytelling",
      "Reputation",
      "Qualitative Research",
      "Quantitative Research"
    ]
  },
  {
    id: "edu-3",
    degree: "Bachelor's Degree in Communication and Society",
    institution: "University of Milan",
    location: "Milan, Italy",
    period: "2019 — 2022",
    grade: "103/110",
    description: "Multidisciplinary curriculum in contemporary communication processes, digital media sociology, cultural semiotics, applied linguistics, language theories, and qualitative social research methods.",
    skillsAcquired: [
      "Media Sociology",
      "Emerging Technologies",
      "Semiotics",
      "Linguistics",
      "Applied Linguistics",
      "Social Research",
      "Quantitative Analysis",
      "Statistics"
    ]
  },
  {
    id: "edu-4",
    degree: "Technical High School Diploma in Computer Science",
    institution: "Guglielmo Marconi Technical Institute",
    location: "Gorgonzola (MI), Italy",
    period: "2013 — 2018",
    grade: "76/100",
    description: "Technical curriculum focused on software engineering fundamentals, algorithmic logic, database management, and network infrastructure, providing the analytical groundwork for digital and media workflows.",
    skillsAcquired: [
      "Computer Science",
      "Programming",
      "Systems",
      "Networks",
      "Cybersecurity",
      "Artificial Intelligence",
      "Electronics"
    ]
  }
];

export const initialLanguagesEN: LanguageItem[] = [
  {
    id: "lang-1",
    language: "Italian",
    flag: "🇮🇹",
    level: "Native Speaker",
    cefr: "C2",
    percentage: 100,
    description: "The language of Dante, Boccaccio, Manzoni, Calvino, and now Simone. Full mastery in drafting texts, hosting events, press releases, and copywriting, without a single hint of dyslexia.",
    usageContext: [
      "Corporate copywriting and storytelling",
      "Press releases and article editing",
      "Presentations and public speaking"
    ],
    color: "from-rose-500 to-pink-500"
  },
  {
    id: "lang-2",
    language: "English",
    flag: "🇬🇧",
    level: "Full Professional Proficiency",
    cefr: "C1",
    percentage: 90,
    description: "Advanced proficiency in written and oral communication, suitable for multinational contexts, and coordination with foreign teams. The accent might be slightly Italianate.",
    usageContext: [
      "Multinational corporate communications",
      "Authoring reports and slide decks",
      "Interviews and international partner dialogue"
    ],
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "lang-3",
    language: "Spanish",
    flag: "🇪🇸",
    level: "Elementary",
    cefr: "A2",
    percentage: 30,
    description: "Basic knowledge, elementary vocabulary, and comprehension of simple texts. Luckily it is almost identical to Italian.",
    usageContext: [
      "Basic everyday interactions",
      "Essential vocabulary",
      "Initial reading and comprehension"
    ],
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "lang-4",
    language: "Other",
    flag: "🌐",
    level: "Rapid Learning",
    cefr: "Fast Learner",
    percentage: 100,
    description: "Chinese, Arabic, German, Russian, and even Bergamasque dialect. If needed, I can learn any language—as long as you have a bit of patience.",
    usageContext: [
      "Immediate readiness for structured study",
      "Intensive corporate immersion courses",
      "Openness to international assignments"
    ],
    color: "from-emerald-500 to-teal-500"
  }
];

export const initialPassionsEN: PassionItem[] = [
  {
    id: "pas-1",
    title: "Photography and Visual Storytelling",
    category: "Visual Arts and Light",
    description: "My passion for photography is relatively recent, and for it I had to learn from scratch a new way of telling stories, made of lights, shadows, contrasts, colors, and a lot of patience. I'm not a professional yet, but photography has already given me great fulfillment.",
    iconName: "Camera",
    tags: ["Photography", "Visual Composition", "Storytelling", "Lightroom"],
    accentColor: "from-rose-500/10 via-pink-500/10 to-violet-500/10"
  },
  {
    id: "pas-2",
    title: "Writing and Narrative Copywriting",
    category: "Literature and Writing",
    description: "I enjoy writing and, modesty aside, I'm quite good at it. I mostly write reflections, short essays, and humorous stories. My most demanding work so far is \"Il Mercante\", a satirical magazine of about fifty pages that I created, wrote, illustrated, formatted, and even printed purely for the love of writing.",
    iconName: "Type",
    tags: ["Creative Writing", "Copywriting", "Essays", "Microcopy"],
    accentColor: "from-indigo-500/10 via-violet-500/10 to-blue-500/10"
  },
  {
    id: "pas-video",
    title: "Videos and Short Films",
    category: "Audiovisual Production",
    description: "I admit it's the passion I pursue least frequently, but then again it's the one that requires the most time and often the most resources. Unfortunately I can't share many of the videos I've made because it would instantly rule out any hiring prospects, but here's one at least.",
    iconName: "Video",
    tags: ["Video Editing", "Short Films", "Storytelling", "YouTube"],
    accentColor: "from-violet-500/10 via-purple-500/10 to-indigo-500/10"
  },
  {
    id: "pas-3",
    title: "Aptitude Tests",
    category: "Introspection & Challenges",
    description: "I can never get enough of them! Sometimes I apply for job openings just for the pure joy of taking a good aptitude test, and with each test I try to beat my personal speed record. For the most part, the questions are all pretty similar so I usually breeze right through, but I love when the challenge gets tough with uncomfortable, personal questions that demand deep introspection, and I'm forced to pause for a few minutes to think. It makes me feel like someone is actually reading my answers.",
    iconName: "ClipboardCheck",
    tags: [],
    accentColor: "from-amber-500/10 via-orange-500/10 to-yellow-500/10"
  }
];

export const initialPoliticalViewsEN: PoliticalViewItem[] = [
  {
    id: "pol-1",
    topic: "Internships and Traineeships",
    stance: "Internships make work truly stimulating, encouraging a process of continuous improvement that renews itself every six months, whereas with a permanent contract employees rest on their laurels and fail to acquire new skills. They are therefore an outstanding tool to increase productivity that will never ever be abused, and indeed, they should be made mandatory by law.",
    description: "Internships make work truly stimulating, encouraging a process of continuous improvement that renews itself every six months.",
    badge: "Training"
  },
  {
    id: "pol-2",
    topic: "Artificial Intelligence",
    stance: "Using Artificial Intelligence to screen resumes and automatically discard hundreds of desperate applicants is a small price to pay to save human resources—the true driving engine of our society—ten minutes of work.",
    description: "Using Artificial Intelligence to screen resumes and automatically discard hundreds of desperate applicants is a small price to pay to save human resources—the true driving engine of our society—ten minutes of work.",
    badge: "Technology"
  },
  {
    id: "pol-3",
    topic: "LinkedIn",
    stance: "Before LinkedIn, finding a job was impossible; now it's effortless. Getting hired has remained hard and probably even harder than before, but at least you can play weekly puzzles while staying unemployed, which is still a step forward.",
    description: "Before LinkedIn, finding a job was impossible; now it's effortless. Getting hired has remained hard and probably even harder than before, but at least you can play weekly puzzles while staying unemployed, which is still a step forward.",
    badge: "Social Network"
  },
  {
    id: "pol-4",
    topic: "The Role of Communication Today",
    stance: "Communication is the greatest asset of our time. I love advertisements and could watch them all day long; I simply don't understand people who use Adblockers or get annoyed by gargantuan billboards plastered over cathedral facades. Furthermore, one must not forget the fundamental role played by digital influencers, shepherds guiding the way in a world of sheep. I hope that one day my children will be influencers.",
    description: "Communication is the greatest asset of our time. I love advertisements and could watch them all day long.",
    badge: "Media"
  },
  {
    id: "pol-5",
    topic: "The Italian Language",
    stance: "Every *azienda* that wants to keep up with the times should *calendarizzare* an *onboarding* to achieve *allineamento* with their *squadra* regarding the use of Italian in corporate *comunicazioni*. Speaking Italian isn't just a *missione* to put on a *tabella di marcia* without any *scadenza*, but an indispensable *competenza* for communicating with one's *parti interessate*. Therefore, *parametri di riferimento* must be implemented to measure the *indicatori chiave* regarding the use of Italian in the *punti di contatto* of one's *attività principale*, because more Italian is always *più bello*.",
    description: "Every modern company should schedule an onboarding to align their team on the use of corporate language.",
    badge: "Language"
  }
];

// UI Translation dictionary
export const uiTranslations = {
  it: {
    nav: {
      about: "Su di me",
      work: "Esperienze",
      education: "Formazione",
      languages: "Lingue",
      passions: "Passioni",
      politics: "Politica",
      discoverMore: "Scopri di più",
      contact: "Contatti"
    },
    sections: {
      work: "Esperienze e Formazione",
      workSubtitle: "Il mio percorso professionale e accademico",
      education: "Formazione",
      educationSubtitle: "Il percorso di studi, i titoli accademici, e le competenze specialistiche acquisite.",
      languages: "Lingue",
      languagesSubtitle: "Livelli secondo il quadro europeo CEFR.",
      passions: "Passioni",
      passionsSubtitle: "Di cosa mi interesso all'infuori del lavoro (solo cose spendibili sul posto di lavoro però, sia mai)",
      politics: "Politica",
      politicsSubtitle: "I valori sui quali ritengo sia importante essere in sintonia",
      discoverMore: "Scopri di più",
      discoverMoreSubtitle: "Passioni, opinioni politiche, feedback e cosa mi distingue.",
      contact: "Contatti",
      contactSubtitle: "Hai una proposta di lavoro, una collaborazione, un progetto interessante, o una minaccia? Scrivimi pure :)"
    },
    hero: {
      exploreWork: "Esplora Esperienze Lavorative",
      printCV: "Scarica curriculum",
      flippedText: "Hai già visto abbastanza",
      availableStatus: "Disponibile per nuove opportunità",
      editPlaceholder: "Modifica Curriculum",
      easterEggFunWithLittle: "Beato te che ti diverti con poco"
    },
    contact: {
      sendMessage: "Scrivimi un Messaggio",
      sendMessageDesc: "",
      yourName: "Il tuo Nome",
      yourEmail: "Il tuo Indirizzo Email",
      subject: "Oggetto",
      message: "Messaggio",
      placeholderName: "es. Guido Piano",
      placeholderEmail: "guido.piano@azienda.it",
      placeholderSubject: "es. Opportunità di collaborazione / Colloquio",
      placeholderMessage: "Raccontami brevemente di cosa si tratta...",
      sendButton: "Invia Messaggio",
      successTitle: "Messaggio inviato con successo!",
      successDesc: "Grazie per avermi contattato. Ho preso nota della tua richiesta e ti risponderò il prima possibile.",
      sendAnother: "Invia un altro messaggio",
      availability: "Indirizzo",
      availabilityHours: "CET / GMT+1 • Melzo (MI) e Remoto",
      socialProfiles: "Profili Social",
      copy: "Copia",
      copied: "Copiata",
      phoneCopied: "Copiato",
      phone: "Telefono"
    },
    languagesSection: {
      fluency: "Padronanza",
      contexts: "Ambiti di applicazione:"
    },
    educationSection: {
      skillsDeveloped: "COMPETENZE SVILUPPATE"
    },
    workSection: {
      achievements: "Principali traguardi:",
      technologies: "COMPETENZE E STRUMENTI",
      currentRole: "Ruolo Attuale"
    },
    footer: {
      rights: "Simone Armanni • Curriculum Vitae. Tutti i diritti riservati.",
      sub: "",
      aiNotice: "Questo sito è stato fatto con l'aiuto dell'IA, ma i testi e le idee sono farina del mio sacco :)",
      noRefund: "Nessun rimborso in caso di assunzione"
    }
  },
  en: {
    nav: {
      about: "About me",
      work: "Experience",
      education: "Education",
      languages: "Languages",
      passions: "Passions",
      politics: "Politics",
      discoverMore: "Discover more",
      contact: "Contacts"
    },
    sections: {
      work: "Experience & Education",
      workSubtitle: "My professional and academic journey",
      education: "Education",
      educationSubtitle: "Academic degrees, leadership programs, and specialized competencies acquired.",
      languages: "Languages",
      languagesSubtitle: "Proficiency levels according to the European CEFR framework.",
      passions: "Passions",
      passionsSubtitle: "What I'm interested in outside of work (only workplace-relevant things, God forbid)",
      politics: "Politics",
      politicsSubtitle: "The values I consider essential to be in tune with",
      discoverMore: "Discover more",
      discoverMoreSubtitle: "Passions, stances, feedback, and what sets me apart.",
      contact: "Contacts",
      contactSubtitle: "Have a job offer, a collaboration, an interesting project, or a threat? Feel free to write to me :)"
    },
    hero: {
      exploreWork: "Explore Work Experience",
      printCV: "Download Resume",
      flippedText: "You've seen enough already",
      availableStatus: "Available for new opportunities",
      editPlaceholder: "Edit Profile",
      easterEggFunWithLittle: "It takes so little to keep you entertained"
    },
    contact: {
      sendMessage: "Send me a Message",
      sendMessageDesc: "",
      yourName: "Your Name",
      yourEmail: "Your Email Address",
      subject: "Subject",
      message: "Message",
      placeholderName: "e.g. Guido Piano",
      placeholderEmail: "guido.piano@company.com",
      placeholderSubject: "e.g. Collaboration opportunity / Interview",
      placeholderMessage: "Tell me briefly what this is about...",
      sendButton: "Send Message",
      successTitle: "Message sent successfully!",
      successDesc: "Thank you for reaching out. I've noted your message and will get back to you promptly.",
      sendAnother: "Send another message",
      availability: "Address",
      availabilityHours: "CET / GMT+1 • Melzo (Milan) and Remote",
      socialProfiles: "Social Profiles",
      copy: "Copy",
      copied: "Copied",
      phoneCopied: "Copied",
      phone: "Phone"
    },
    languagesSection: {
      fluency: "Fluency",
      contexts: "Application contexts:"
    },
    educationSection: {
      skillsDeveloped: "DEVELOPED SKILLS"
    },
    workSection: {
      achievements: "Key achievements:",
      technologies: "SKILLS AND TOOLS",
      currentRole: "Current Role"
    },
    footer: {
      rights: "Simone Armanni • Curriculum Vitae. All rights reserved.",
      sub: "",
      aiNotice: "This website was built with the help of AI, but the copy and ideas are entirely my own :)",
      noRefund: "No refunds upon hiring"
    }
  }
};
