"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume, WorkExperience } from "@/types";
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { generateId } from "@/lib/utils";
import { aiService } from "@/services/ai.service";
import { toast } from "sonner";

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

const emptyExp = (): WorkExperience => ({
  id: generateId(),
  company: "",
  position: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  bullets: [],
});

export function ExperienceStep({ data, onChange }: Props) {
  const experiences = (data.experience || []) as WorkExperience[];
  const [expanded, setExpanded] = useState<string | null>(experiences[0]?.id || null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const add = () => {
    const exp = emptyExp();
    onChange({ experience: [...experiences, exp] });
    setExpanded(exp.id!);
  };

  const update = (id: string, updates: Partial<WorkExperience>) => {
    onChange({ experience: experiences.map((e) => e.id === id ? { ...e, ...updates } : e) });
  };

  const remove = (id: string) => {
    onChange({ experience: experiences.filter((e) => e.id !== id) });
  };

  const generateBullets = async (exp: WorkExperience) => {
    if (!exp.position || !exp.company) {
      toast.error("Add a position and company first");
      return;
    }
    try {
      setGeneratingFor(exp.id!);
      const result = await aiService.generateBullets(exp.position, exp.company, exp.description || exp.position);
      update(exp.id!, { bullets: result.bullets });
      toast.success("Bullets generated!");
    } catch {
      toast.error("Failed to generate bullets");
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="border rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id!)}
            >
              <div>
                <p className="font-medium text-sm">{exp.position || "New Position"}</p>
                <p className="text-xs text-muted-foreground">{exp.company || "Company"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(exp.id!); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {expanded === exp.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>

            {expanded === exp.id && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Position *</Label>
                    <Input className="mt-1 h-8 text-sm" value={exp.position} onChange={(e) => update(exp.id!, { position: e.target.value })} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <Label className="text-xs">Company *</Label>
                    <Input className="mt-1 h-8 text-sm" value={exp.company} onChange={(e) => update(exp.id!, { company: e.target.value })} placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Start Date</Label>
                    <Input className="mt-1 h-8 text-sm" type="month" value={exp.start_date} onChange={(e) => update(exp.id!, { start_date: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">End Date</Label>
                    <Input className="mt-1 h-8 text-sm" type="month" value={exp.end_date} onChange={(e) => update(exp.id!, { end_date: e.target.value })} disabled={exp.is_current} />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input type="checkbox" checked={exp.is_current} onChange={(e) => update(exp.id!, { is_current: e.target.checked, end_date: "" })} />
                      Current
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea className="mt-1 text-sm min-h-[80px] resize-none" value={exp.description || ""} onChange={(e) => update(exp.id!, { description: e.target.value })} placeholder="Describe your role and responsibilities..." />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Bullet Points</Label>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => generateBullets(exp)} disabled={!!generatingFor}>
                      {generatingFor === exp.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                      AI Generate
                    </Button>
                  </div>
                  {exp.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span className="text-muted-foreground mt-2 text-xs">•</span>
                      <Input className="h-8 text-sm flex-1" value={bullet} onChange={(e) => {
                        const newBullets = [...exp.bullets];
                        newBullets[i] = e.target.value;
                        update(exp.id!, { bullets: newBullets });
                      }} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => update(exp.id!, { bullets: exp.bullets.filter((_, j) => j !== i) })}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="ghost" className="text-xs h-7 mt-1" onClick={() => update(exp.id!, { bullets: [...exp.bullets, ""] })}>
                    <Plus className="mr-1 h-3 w-3" />Add bullet
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button variant="outline" onClick={add} className="w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" />Add Experience
        </Button>
      </CardContent>
    </Card>
  );
}
