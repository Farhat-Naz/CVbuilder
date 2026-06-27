"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume, Skills } from "@/types";
import { Plus, X, Code, Brain, Globe, Sparkles, Loader2 } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { toast } from "sonner";

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

export function SkillsStep({ data, onChange }: Props) {
  const skills = (data.skills || { technical: [], soft: [], languages: [] }) as Skills;
  const [inputs, setInputs] = useState({ technical: "", soft: "", languages: "" });
  const [jobTitle, setJobTitle] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  const addSkill = (type: keyof Skills) => {
    const val = inputs[type].trim();
    if (!val) return;
    const existing = skills[type] || [];
    if (!existing.includes(val)) {
      onChange({ skills: { ...skills, [type]: [...existing, val] } });
    }
    setInputs((prev) => ({ ...prev, [type]: "" }));
  };

  const removeSkill = (type: keyof Skills, skill: string) => {
    onChange({ skills: { ...skills, [type]: (skills[type] || []).filter((s) => s !== skill) } });
  };

  const suggestSkills = async () => {
    if (!jobTitle) { toast.error("Enter a job title first"); return; }
    try {
      setSuggesting(true);
      const result = await aiService.suggestSkills(jobTitle, skills.technical);
      const newSkills = result.skills.filter((s: string) => !skills.technical.includes(s));
      onChange({ skills: { ...skills, technical: [...skills.technical, ...newSkills.slice(0, 8)] } });
      toast.success(`Added ${Math.min(newSkills.length, 8)} skill suggestions`);
    } catch {
      toast.error("Failed to suggest skills");
    } finally {
      setSuggesting(false);
    }
  };

  const sections = [
    { key: "technical" as keyof Skills, label: "Technical Skills", icon: Code, placeholder: "e.g., React, Python, AWS" },
    { key: "soft" as keyof Skills, label: "Soft Skills", icon: Brain, placeholder: "e.g., Leadership, Communication" },
    { key: "languages" as keyof Skills, label: "Languages", icon: Globe, placeholder: "e.g., English (Native), Spanish" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Suggestions */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />AI Skill Suggestions
          </p>
          <div className="flex gap-2">
            <Input className="h-8 text-sm flex-1" placeholder="Job Title (e.g., Frontend Developer)" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Button size="sm" onClick={suggestSkills} disabled={suggesting} className="bg-blue-600 text-white hover:bg-blue-700 shrink-0">
              {suggesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {sections.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key}>
            <Label className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />{label}
            </Label>
            <div className="flex gap-2 mb-3">
              <Input
                className="h-8 text-sm"
                placeholder={placeholder}
                value={inputs[key]}
                onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addSkill(key)}
              />
              <Button size="sm" variant="outline" className="h-8 shrink-0" onClick={() => addSkill(key)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(skills[key] || []).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs pr-1.5 gap-1">
                  {skill}
                  <button onClick={() => removeSkill(key, skill)} className="ml-1 hover:text-destructive">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              {(skills[key] || []).length === 0 && (
                <p className="text-xs text-muted-foreground">No {label.toLowerCase()} added yet</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
