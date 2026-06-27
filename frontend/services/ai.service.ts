import api from "@/lib/api";
import { ATSScore } from "@/types";

export const aiService = {
  async generateSummary(data: {
    job_title: string;
    experience_years: number;
    skills: string[];
    industry?: string;
  }): Promise<{ summary: string }> {
    const { data: res } = await api.post("/ai/generate-summary", data);
    return res;
  },

  async rewrite(content: string, tone = "professional"): Promise<{ content: string }> {
    const { data } = await api.post("/ai/rewrite", { content, tone });
    return data;
  },

  async checkATS(resume_text: string, job_description?: string): Promise<ATSScore> {
    const { data } = await api.post("/ai/ats-score", { resume_text, job_description });
    return data;
  },

  async fixGrammar(text: string): Promise<{ text: string }> {
    const { data } = await api.post("/ai/fix-grammar", { text });
    return data;
  },

  async optimizeKeywords(resume_text: string, job_description: string) {
    const { data } = await api.post("/ai/optimize-keywords", { resume_text, job_description });
    return data;
  },

  async generateBullets(job_title: string, company: string, responsibilities: string): Promise<{ bullets: string[] }> {
    const { data } = await api.post("/ai/generate-bullets", { job_title, company, responsibilities });
    return data;
  },

  async suggestSkills(job_title: string, current_skills: string[]): Promise<{ skills: string[] }> {
    const { data } = await api.post("/ai/suggest-skills", { job_title, current_skills });
    return data;
  },
};
