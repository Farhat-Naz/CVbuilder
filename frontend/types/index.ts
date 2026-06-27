export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  subscription_plan: "free" | "pro" | "premium";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  bullets: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  achievements: string[];
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date?: string;
  expiry?: string;
  credential_id?: string;
  url?: string;
}

export interface Achievement {
  id?: string;
  title: string;
  description?: string;
  date?: string;
}

export interface Reference {
  id?: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  portfolio: string | null;
  github: string | null;
  summary: string | null;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  references: Reference[];
  ats_score: number | null;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  title: string;
  company_name: string | null;
  hiring_manager: string | null;
  job_title: string | null;
  job_description: string | null;
  tone: string;
  experience_level: string;
  content: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  is_premium: boolean;
  tags: string[];
  description?: string;
  preview_url?: string;
  thumbnail_url?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ATSScore {
  score: number;
  grade: string;
  issues: string[];
  suggestions: string[];
  keyword_matches: string[];
  missing_keywords: string[];
}
