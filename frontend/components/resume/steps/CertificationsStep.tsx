"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume, Certification } from "@/types";
import { Plus, Trash2, Award } from "lucide-react";
import { generateId } from "@/lib/utils";

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

const empty = (): Certification => ({ id: generateId(), name: "", issuer: "", date: "", url: "" });

export function CertificationsStep({ data, onChange }: Props) {
  const certs = (data.certifications || []) as Certification[];

  const add = () => onChange({ certifications: [...certs, empty()] });

  const update = (id: string, updates: Partial<Certification>) => {
    onChange({ certifications: certs.map((c) => c.id === id ? { ...c, ...updates } : c) });
  };

  const remove = (id: string) => onChange({ certifications: certs.filter((c) => c.id !== id) });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {certs.map((cert) => (
          <div key={cert.id} className="border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{cert.name || "New Certification"}</p>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(cert.id!)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Certification Name *</Label>
                <Input className="mt-1 h-8 text-sm" value={cert.name} onChange={(e) => update(cert.id!, { name: e.target.value })} placeholder="AWS Solutions Architect" />
              </div>
              <div>
                <Label className="text-xs">Issuing Organization *</Label>
                <Input className="mt-1 h-8 text-sm" value={cert.issuer} onChange={(e) => update(cert.id!, { issuer: e.target.value })} placeholder="Amazon" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input className="mt-1 h-8 text-sm" type="month" value={cert.date || ""} onChange={(e) => update(cert.id!, { date: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">URL</Label>
                <Input className="mt-1 h-8 text-sm" value={cert.url || ""} onChange={(e) => update(cert.id!, { url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={add} className="w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" />Add Certification
        </Button>
      </CardContent>
    </Card>
  );
}
