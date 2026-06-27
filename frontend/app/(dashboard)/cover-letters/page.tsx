"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Mail, Loader2, Copy, Download, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { coverLetterService } from "@/services/cover-letter.service";
import { CoverLetter } from "@/types";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function CoverLettersPage() {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    company_name: "", hiring_manager: "", job_title: "", job_description: "",
    tone: "professional", experience_level: "mid", user_background: "",
  });
  const [generatedContent, setGeneratedContent] = useState("");

  useEffect(() => {
    coverLetterService.list().then(setCoverLetters).finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    if (!form.company_name || !form.job_title || !form.job_description) {
      toast.error("Please fill in company, job title, and job description");
      return;
    }
    try {
      setGenerating(true);
      const result = await coverLetterService.generate(form);
      setGeneratedContent(result.content);
    } catch {
      toast.error("Failed to generate. Please check your API configuration.");
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    try {
      const cl = await coverLetterService.create({
        title: `Cover Letter - ${form.job_title} at ${form.company_name}`,
        ...form,
        content: generatedContent,
      });
      setCoverLetters((prev) => [...prev, cl]);
      setDialogOpen(false);
      setGeneratedContent("");
      setForm({ company_name: "", hiring_manager: "", job_title: "", job_description: "", tone: "professional", experience_level: "mid", user_background: "" });
      toast.success("Cover letter saved!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save");
    }
  };

  const deleteCL = async (id: string) => {
    await coverLetterService.delete(id);
    setCoverLetters((prev) => prev.filter((c) => c.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Cover Letters</h1>
          <p className="text-muted-foreground text-sm mt-1">{coverLetters.length} cover letter{coverLetters.length !== 1 ? "s" : ""}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <span className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 h-10 px-4 py-2 cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />New Cover Letter
            </span>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />AI Cover Letter Generator
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Company Name *</Label>
                    <Input className="mt-1 h-8 text-sm" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Google" />
                  </div>
                  <div>
                    <Label className="text-xs">Job Title *</Label>
                    <Input className="mt-1 h-8 text-sm" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="Senior Engineer" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Hiring Manager</Label>
                  <Input className="mt-1 h-8 text-sm" value={form.hiring_manager} onChange={(e) => setForm({ ...form, hiring_manager: e.target.value })} placeholder="Jane Doe (optional)" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Tone</Label>
                    <Select value={form.tone} onValueChange={(v) => v && setForm({ ...form, tone: v })}>
                      <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["professional", "friendly", "enthusiastic", "formal", "conversational"].map((t) => (
                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Experience Level</Label>
                    <Select value={form.experience_level} onValueChange={(v) => v && setForm({ ...form, experience_level: v })}>
                      <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["entry", "mid", "senior", "executive"].map((l) => (
                          <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Job Description *</Label>
                  <Textarea className="mt-1 text-sm min-h-[120px] resize-none" value={form.job_description} onChange={(e) => setForm({ ...form, job_description: e.target.value })} placeholder="Paste the job description here..." />
                </div>
                <div>
                  <Label className="text-xs">Your Background (optional)</Label>
                  <Textarea className="mt-1 text-sm min-h-[60px] resize-none" value={form.user_background} onChange={(e) => setForm({ ...form, user_background: e.target.value })} placeholder="Brief summary of your experience..." />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={generate} disabled={generating}>
                  {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Cover Letter</>}
                </Button>
              </div>

              {/* Generated content */}
              <div className="space-y-3">
                <Label className="text-xs">Generated Cover Letter</Label>
                <Textarea
                  className="min-h-[350px] text-sm resize-none"
                  placeholder="Your generated cover letter will appear here..."
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(generatedContent); toast.success("Copied!"); }} disabled={!generatedContent}>
                    <Copy className="mr-2 h-3.5 w-3.5" />Copy
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={save} disabled={!generatedContent}>
                    Save Cover Letter
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : coverLetters.length === 0 ? (
        <div className="border-2 border-dashed rounded-2xl p-16 text-center">
          <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold text-lg mb-2">No cover letters yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Generate a personalized cover letter for your next application</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coverLetters.map((cl, i) => (
            <motion.div key={cl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group rounded-xl border bg-card p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={() => deleteCL(cl.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <h3 className="font-medium text-sm truncate">{cl.title ?? "Cover Letter"}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{cl.company_name ?? ""} · {cl.job_title ?? ""}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(cl.created_at)}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
