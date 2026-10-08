export type AppLanguage = "it" | "en";

export interface UserProfile {
  name: string;
  role: string;
  tagline: string;
  shortBio: string;
  extendedBio: string[];
  location: string;
  status: string;
  email: string;
  phone: string;
  website: string;
  flickr: string;
  linkedin: string;
  avatarUrl: string;
  stats: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
  keySkills: string[];
  softSkills?: string[];
}

export interface WorkItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
  accentColor: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade?: string;
  description: string;
  skillsAcquired: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  flag: string;
  level: string;
  cefr: string;
  percentage: number;
  description: string;
  usageContext: string[];
  color: string;
}

export interface PassionItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  tags: string[];
  accentColor: string;
}

export interface PoliticalViewItem {
  id: string;
  topic: string;
  stance: string;
  description: string;
  quote?: string;
  badge: string;
}
