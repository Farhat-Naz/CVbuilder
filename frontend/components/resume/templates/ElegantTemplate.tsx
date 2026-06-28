import { Resume, formatDate } from "./shared";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

export function ElegantTemplate({ resume }: { resume: Resume }) {
  const { full_name, email, phone, location, linkedin, portfolio, github, summary, experience = [], education = [], skills, projects = [], certifications = [] } = resume;

  return (
    <div className="bg-white text-gray-900 text-[11px] leading-relaxed font-serif min-h-[842px]">
      {/* Charcoal header */}
      <div className="bg-gray-900 text-white px-8 py-7">
        <h1 className="text-3xl font-bold tracking-wide">{full_name || "Your Name"}</h1>
        <div className="w-12 h-0.5 bg-amber-400 mt-2 mb-3" />
        <div className="flex flex-wrap gap-4 text-gray-300 text-[10px] font-sans">
          {email && <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{email}</span>}
          {phone && <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{phone}</span>}
          {location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{location}</span>}
          {linkedin && <span className="flex items-center gap-1"><Link2 className="w-2.5 h-2.5" />{linkedin}</span>}
          {portfolio && <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{portfolio}</span>}
          {github && <span className="flex items-center gap-1"><GitBranch className="w-2.5 h-2.5" />{github}</span>}
        </div>
      </div>

      <div className="p-8">
        {summary && (
          <div className="mb-6 border-l-2 border-amber-400 pl-4">
            <p className="text-gray-600 italic leading-loose">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <Section title="Professional Experience">
            {experience.map((exp, i) => (
              <div key={i} className={i > 0 ? "mt-5" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-gray-900 font-sans">{exp.position}</p>
                    <p className="text-amber-700 font-medium font-sans">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-gray-500 text-[10px] font-sans">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                </div>
                {exp.bullets?.length > 0 ? (
                  <ul className="mt-2 space-y-0.5">{exp.bullets.map((b, j) => <li key={j} className="flex gap-2 font-sans"><span className="text-amber-500 font-bold">◆</span><span className="text-gray-700">{b}</span></li>)}</ul>
                ) : exp.description ? <p className="mt-1.5 text-gray-700 font-sans">{exp.description}</p> : null}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <div key={i} className={`flex justify-between ${i > 0 ? "mt-3" : ""}`}>
                <div>
                  <p className="font-bold text-sm font-sans">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-amber-700 font-sans">{edu.institution}</p>
                </div>
                <div className="text-right text-gray-500 font-sans">
                  <p>{formatDate(edu.start_date)} – {formatDate(edu.end_date)}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) ? (
          <Section title="Skills & Expertise">
            <div className="space-y-1.5 font-sans">
              {skills.technical?.length > 0 && (
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-800 w-20 shrink-0">Technical</span>
                  <div className="flex flex-wrap gap-1">{skills.technical.map((s, i) => <span key={i} className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px]">{s}</span>)}</div>
                </div>
              )}
              {skills.soft?.length > 0 && <div className="flex gap-2"><span className="font-semibold text-gray-800 w-20 shrink-0">Soft Skills</span><span className="text-gray-600">{skills.soft.join(" · ")}</span></div>}
              {skills.languages?.length > 0 && <div className="flex gap-2"><span className="font-semibold text-gray-800 w-20 shrink-0">Languages</span><span className="text-gray-600">{skills.languages.join(" · ")}</span></div>}
            </div>
          </Section>
        ) : null}

        {projects.length > 0 && (
          <Section title="Notable Projects">
            {projects.map((proj, i) => (
              <div key={i} className={`font-sans ${i > 0 ? "mt-3" : ""}`}>
                <p className="font-bold text-sm text-gray-900">{proj.name}{proj.technologies?.length > 0 && <span className="font-normal text-gray-500"> · {proj.technologies.join(", ")}</span>}</p>
                {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((cert, i) => (
              <div key={i} className={`flex justify-between font-sans ${i > 0 ? "mt-1.5" : ""}`}>
                <span><span className="font-medium">{cert.name}</span> · <span className="text-gray-500">{cert.issuer}</span></span>
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
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 whitespace-nowrap">{title}</h2>
        <div className="flex-1 h-px bg-amber-300" />
      </div>
      {children}
    </div>
  );
}
