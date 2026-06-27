"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume, Education } from "@/types";
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { generateId } from "@/lib/utils";

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

const emptyEdu = (): Education => ({
  id: generateId(),
  institution: "",
  degree: "",
  field: "",
  location: "",
  start_date: "",
  end_date: "",
  gpa: "",
  achievements: [],
});

export function EducationStep({ data, onChange }: Props) {
  const educations = (data.education || []) as Education[];
  const [expanded, setExpanded] = useState<string | null>(educations[0]?.id || null);

  const add = () => {
    const edu = emptyEdu();
    onChange({ education: [...educations, edu] });
    setExpanded(edu.id!);
  };

  const update = (id: string, updates: Partial<Education>) => {
    onChange({ education: educations.map((e) => e.id === id ? { ...e, ...updates } : e) });
  };

  const remove = (id: string) => {
    onChange({ education: educations.filter((e) => e.id !== id) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {educations.map((edu) => (
          <div key={edu.id} className="border rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => setExpanded(expanded === edu.id ? null : edu.id!)}
            >
              <div>
                <p className="font-medium text-sm">{edu.degree || "Degree"} {edu.field ? `in ${edu.field}` : ""}</p>
                <p className="text-xs text-muted-foreground">{edu.institution || "Institution"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); remove(edu.id!); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {expanded === edu.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
            {expanded === edu.id && (
              <div className="p-4 border-t space-y-3">
                <div>
                  <Label className="text-xs">Institution *</Label>
                  <Input className="mt-1 h-8 text-sm" value={edu.institution} onChange={(e) => update(edu.id!, { institution: e.target.value })} placeholder="MIT" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Degree</Label>
                    <Input className="mt-1 h-8 text-sm" value={edu.degree} onChange={(e) => update(edu.id!, { degree: e.target.value })} placeholder="Bachelor's" />
                  </div>
                  <div>
                    <Label className="text-xs">Field of Study</Label>
                    <Input className="mt-1 h-8 text-sm" value={edu.field || ""} onChange={(e) => update(edu.id!, { field: e.target.value })} placeholder="Computer Science" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Start Date</Label>
                    <Input className="mt-1 h-8 text-sm" type="month" value={edu.start_date} onChange={(e) => update(edu.id!, { start_date: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">End Date</Label>
                    <Input className="mt-1 h-8 text-sm" type="month" value={edu.end_date || ""} onChange={(e) => update(edu.id!, { end_date: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">GPA</Label>
                    <Input className="mt-1 h-8 text-sm" value={edu.gpa || ""} onChange={(e) => update(edu.id!, { gpa: e.target.value })} placeholder="3.8" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={add} className="w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" />Add Education
        </Button>
      </CardContent>
    </Card>
  );
}
