import api from "@/lib/api";
import { Resume } from "@/types";

export const resumeService = {
  async list(): Promise<Resume[]> {
    const { data } = await api.get<Resume[]>("/resumes/");
    return data;
  },

  async get(id: string): Promise<Resume> {
    const { data } = await api.get<Resume>(`/resumes/${id}`);
    return data;
  },

  async create(payload: Partial<Resume>): Promise<Resume> {
    const { data } = await api.post<Resume>("/resumes/", payload);
    return data;
  },

  async update(id: string, payload: Partial<Resume>): Promise<Resume> {
    const { data } = await api.put<Resume>(`/resumes/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/resumes/${id}`);
  },

  async duplicate(id: string): Promise<Resume> {
    const { data } = await api.post<Resume>(`/resumes/${id}/duplicate`);
    return data;
  },
};
