"use client";

import { useState, useEffect, useCallback } from "react";
import { Resume } from "@/types";
import { resumeService } from "@/services/resume.service";
import { toast } from "sonner";

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await resumeService.list();
      setResumes(data);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const deleteResume = useCallback(async (id: string) => {
    await resumeService.delete(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    toast.success("Resume deleted");
  }, []);

  const duplicateResume = useCallback(async (id: string) => {
    const copy = await resumeService.duplicate(id);
    setResumes((prev) => [...prev, copy]);
    toast.success("Resume duplicated");
    return copy;
  }, []);

  return { resumes, loading, refetch: fetchResumes, deleteResume, duplicateResume };
}
