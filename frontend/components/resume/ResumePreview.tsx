"use client";

import { Resume } from "@/types";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  resume: Resume;
  scale?: number;
  className?: string;
}

export function ResumePreview({ resume, scale = 1, className }: Props) {
  const {
    full_name, email, phone, location, linkedin, portfolio, github, summary,
    experience = [], education = [], skills, projects = [], certifications = [],
  } = resume;

  return (
    <div className={cn("bg-white text-gray-900 rounded-xl shadow-xl overflow-hidden", className)} style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <div className="p-8 text-[11px] leading-relaxed font-sans min-h-[842px]">
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{full_name || "Your Name"}</h1>
          <div className="flex flex-wrap justify-center gap-3 text-gray-500">
            {email && <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{email}</span>}
            {phone && <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{phone}</span>}
            {location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{location}</span>}
            {linkedin && <span className="flex items-center gap-1"><Link2 className="w-2.5 h-2.5" />{linkedin}</span>}
            {portfolio && <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{portfolio}</span>}
            {github && <span className="flex items-center gap-1"><GitBranch className="w-2.5 h-2.5" />{github}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <Section title="Professional Summary">
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience">
            {experience.map((exp: any, i: number) => (
              <div key={i} className={i > 0 ? "mt-4" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{exp.position}</p>
                    <p className="text-blue-600 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-gray-500 text-right whitespace-nowrap">
                    {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </p>
                </div>
                {exp.bullets?.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.bullets.map((b: string, j: number) => (
                      <li key={j} className="flex gap-2"><span className="text-blue-600 mt-0.5">•</span><span className="text-gray-700">{b}</span></li>
                    ))}
                  </ul>
                )}
                {!exp.bullets?.length && exp.description && (
                  <p className="mt-1.5 text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu: any, i: number) => (
              <div key={i} className={i > 0 ? "mt-3" : ""}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-blue-600">{edu.institution}</p>
                  </div>
                  <div className="text-right text-gray-500">
                    <p>{formatDate(edu.start_date)} – {formatDate(edu.end_date)}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) ? (
          <Section title="Skills">
            <div className="space-y-1.5">
              {skills?.technical?.length > 0 && (
                <div className="flex gap-2"><span className="font-medium text-gray-700 w-20 shrink-0">Technical:</span><span className="text-gray-700">{skills.technical.join(" · ")}</span></div>
              )}
              {skills?.soft?.length > 0 && (
                <div className="flex gap-2"><span className="font-medium text-gray-700 w-20 shrink-0">Soft Skills:</span><span className="text-gray-700">{skills.soft.join(" · ")}</span></div>
              )}
              {skills?.languages?.length > 0 && (
                <div className="flex gap-2"><span className="font-medium text-gray-700 w-20 shrink-0">Languages:</span><span className="text-gray-700">{skills.languages.join(" · ")}</span></div>
              )}
            </div>
          </Section>
        ) : null}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((proj: any, i: number) => (
              <div key={i} className={i > 0 ? "mt-3" : ""}>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{proj.name}</p>
                  {proj.technologies?.length > 0 && <span className="text-gray-400">·</span>}
                  {proj.technologies?.length > 0 && <span className="text-gray-500">{proj.technologies.join(", ")}</span>}
                </div>
                {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className={`flex justify-between ${i > 0 ? "mt-1.5" : ""}`}>
                <div>
                  <span className="font-medium text-sm">{cert.name}</span>
                  <span className="text-gray-500"> · {cert.issuer}</span>
                </div>
                {cert.date && <span className="text-gray-500">{formatDate(cert.date)}</span>}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 pb-1 border-b border-blue-200">{title}</h2>
      {children}
    </div>
  );
}
