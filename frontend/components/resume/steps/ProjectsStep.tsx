"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume, Project } from "@/types";
import { Plus, Trash2, ChevronDown, ChevronUp, FolderKanban, X } from "lucide-react";
import { generateId } from "@/lib/utils";

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

const empty = (): Project => ({ id: generateId(), name: "", description: "", technologies: [], url: "", github_url: "" });

export function ProjectsStep({ data, onChange }: Props) {
  const projects = (data.projects || []) as Project[];
  const [expanded, setExpanded] = useState<string | null>(null);
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const add = () => {
    const p = empty();
    onChange({ projects: [...projects, p] });
    setExpanded(p.id!);
  };

  const update = (id: string, updates: Partial<Project>) => {
    onChange({ projects: projects.map((p) => p.id === id ? { ...p, ...updates } : p) });
  };

  const remove = (id: string) => onChange({ projects: projects.filter((p) => p.id !== id) });

  const addTech = (id: string) => {
    const val = (techInput[id] || "").trim();
    if (!val) return;
    const proj = projects.find((p) => p.id === id);
    if (proj && !proj.technologies.includes(val)) {
      update(id, { technologies: [...proj.technologies, val] });
    }
    setTechInput((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-blue-600" />Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((proj) => (
          <div key={proj.id} className="border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50" onClick={() => setExpanded(expanded === proj.id ? null : proj.id!)}>
              <div>
                <p className="font-medium text-sm">{proj.name || "New Project"}</p>
                {proj.technologies.length > 0 && <p className="text-xs text-muted-foreground">{proj.technologies.slice(0, 3).join(", ")}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); remove(proj.id!); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {expanded === proj.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
            {expanded === proj.id && (
              <div className="p-4 border-t space-y-3">
                <div>
                  <Label className="text-xs">Project Name *</Label>
                  <Input className="mt-1 h-8 text-sm" value={proj.name} onChange={(e) => update(proj.id!, { name: e.target.value })} placeholder="My Awesome Project" />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea className="mt-1 text-sm min-h-[80px] resize-none" value={proj.description || ""} onChange={(e) => update(proj.id!, { description: e.target.value })} placeholder="Describe your project..." />
                </div>
                <div>
                  <Label className="text-xs">Technologies</Label>
                  <div className="flex gap-2 mt-1">
                    <Input className="h-8 text-sm" placeholder="React, Node.js..." value={techInput[proj.id!] || ""} onChange={(e) => setTechInput((prev) => ({ ...prev, [proj.id!]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addTech(proj.id!)} />
                    <Button size="sm" variant="outline" className="h-8" onClick={() => addTech(proj.id!)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                        <button className="ml-1" onClick={() => update(proj.id!, { technologies: proj.technologies.filter((x) => x !== t) })}><X className="h-2.5 w-2.5" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Live URL</Label>
                    <Input className="mt-1 h-8 text-sm" value={proj.url || ""} onChange={(e) => update(proj.id!, { url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <Label className="text-xs">GitHub URL</Label>
                    <Input className="mt-1 h-8 text-sm" value={proj.github_url || ""} onChange={(e) => update(proj.id!, { github_url: e.target.value })} placeholder="github.com/..." />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={add} className="w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" />Add Project
        </Button>
      </CardContent>
    </Card>
  );
}
