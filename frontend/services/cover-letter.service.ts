import api from "@/lib/api";
import { CoverLetter } from "@/types";

export const coverLetterService = {
  async list(): Promise<CoverLetter[]> {
    const { data } = await api.get<CoverLetter[]>("/cover-letters/");
    return data;
  },

  async get(id: string): Promise<CoverLetter> {
    const { data } = await api.get<CoverLetter>(`/cover-letters/${id}`);
    return data;
  },

  async create(payload: Partial<CoverLetter>): Promise<CoverLetter> {
    const { data } = await api.post<CoverLetter>("/cover-letters/", payload);
    return data;
  },

  async update(id: string, payload: Partial<CoverLetter>): Promise<CoverLetter> {
    const { data } = await api.put<CoverLetter>(`/cover-letters/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cover-letters/${id}`);
  },

  async generate(payload: {
    company_name: string;
    hiring_manager?: string;
    job_title: string;
    job_description: string;
    tone: string;
    experience_level: string;
    user_background?: string;
  }): Promise<{ content: string }> {
    const { data } = await api.post("/cover-letters/generate", payload);
    return data;
  },
};
