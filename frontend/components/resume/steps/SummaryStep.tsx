"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume } from "@/types";
import { Sparkles, Loader2, AlignLeft } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { toast } from "sonner";

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

export function SummaryStep({ data, onChange }: Props) {
  const [jobTitle, setJobTitle] = useState("");
  const [experienceYears, setExperienceYears] = useState("3");
  const [generating, setGenerating] = useState(false);

  const generateSummary = async () => {
    if (!jobTitle) {
      toast.error("Please enter a job title first");
      return;
    }
    try {
      setGenerating(true);
      const skills = data.skills?.technical || [];
      const result = await aiService.generateSummary({
        job_title: jobTitle,
        experience_years: parseInt(experienceYears) || 3,
        skills,
      });
      onChange({ summary: result.summary });
      toast.success("Summary generated!");
    } catch {
      toast.error("Failed to generate summary. Check your API key.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-blue-600" />Professional Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />AI Summary Generator
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="text-xs">Job Title</Label>
              <Input className="mt-1 h-8 text-sm" placeholder="Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Years of Experience</Label>
              <Input className="mt-1 h-8 text-sm" type="number" min="0" max="40" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
            </div>
          </div>
          <Button size="sm" onClick={generateSummary} disabled={generating} className="bg-blue-600 text-white hover:bg-blue-700">
            {generating ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-3.5 w-3.5" />Generate with AI</>}
          </Button>
        </div>

        <div>
          <Label>Summary</Label>
          <Textarea
            className="mt-1.5 min-h-[140px] resize-none"
            placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
            value={data.summary || ""}
            onChange={(e) => onChange({ summary: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">{(data.summary || "").length} / 500 characters</p>
        </div>
      </CardContent>
    </Card>
  );
}
