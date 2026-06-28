"use client";

import { Resume } from "@/types";
import { cn } from "@/lib/utils";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { TwoColumnTemplate } from "./templates/TwoColumnTemplate";
import { DeveloperTemplate } from "./templates/DeveloperTemplate";

interface Props {
  resume: Resume;
  scale?: number;
  className?: string;
  id?: string;
}

const TEMPLATE_MAP: Record<string, React.ComponentType<{ resume: Resume }>> = {
  // Classic layout
  classic: ClassicTemplate,
  student: ClassicTemplate,
  internship: ClassicTemplate,
  academic: ClassicTemplate,
  government: ClassicTemplate,
  healthcare: ClassicTemplate,
  international: ClassicTemplate,

  // Modern layout
  modern: ModernTemplate,
  remote: ModernTemplate,
  timeline: ModernTemplate,
  marketing: ModernTemplate,
  corporate: ModernTemplate,

  // Minimal layout
  minimal: MinimalTemplate,
  compact: MinimalTemplate,

  // Elegant layout
  elegant: ElegantTemplate,
  executive: ElegantTemplate,
  finance: ElegantTemplate,

  // Two-column layout
  "two-column": TwoColumnTemplate,
  sidebar: TwoColumnTemplate,
  designer: TwoColumnTemplate,
  freelancer: TwoColumnTemplate,
  creative: TwoColumnTemplate,
  infographic: TwoColumnTemplate,

  // Developer layout
  developer: DeveloperTemplate,
  engineering: DeveloperTemplate,
};

export function ResumePreview({ resume, scale = 1, className, id }: Props) {
  const templateId = resume.template_id || "classic";
  const Template = TEMPLATE_MAP[templateId] ?? ClassicTemplate;

  return (
    <div
      id={id}
      className={cn("rounded-xl shadow-xl overflow-hidden", className)}
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      <Template resume={resume} />
    </div>
  );
}
