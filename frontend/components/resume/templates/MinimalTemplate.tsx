import { Resume, formatDate } from "./shared";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

export function MinimalTemplate({ resume }: { resume: Resume }) {
  const { full_name, email, phone, location, linkedin, portfolio, github, summary, experience = [], education = [], skills, projects = [], certifications = [] } = resume;

  return (
    <div className="bg-white text-gray-900 p-10 text-[11px] leading-relaxed font-sans min-h-[842px]">
      {/* Minimal header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{full_name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-400 text-[10px]">
          {email && <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{email}</span>}
          {phone && <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{phone}</span>}
          {location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{location}</span>}
          {linkedin && <span className="flex items-center gap-1"><Link2 className="w-2.5 h-2.5" />{linkedin}</span>}
          {portfolio && <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{portfolio}</span>}
          {github && <span className="flex items-center gap-1"><GitBranch className="w-2.5 h-2.5" />{github}</span>}
        </div>
        <div className="mt-4 h-px bg-gray-200" />
      </div>

      {summary && (
        <div className="mb-6">
          <p className="text-gray-600 leading-loose">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-5" : ""}>
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-900">{exp.position}</p>
                <p className="text-gray-400 text-[10px]">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
              </div>
              <p className="text-gray-500 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
              {exp.bullets?.length > 0 ? (
                <ul className="space-y-0.5 text-gray-600">{exp.bullets.map((b, j) => <li key={j} className="flex gap-2"><span>—</span><span>{b}</span></li>)}</ul>
              ) : exp.description ? <p className="text-gray-600">{exp.description}</p> : null}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} className={`flex justify-between items-start ${i > 0 ? "mt-3" : ""}`}>
              <div>
                <p className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                <p className="text-gray-500">{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
              </div>
              <p className="text-gray-400">{formatDate(edu.start_date)} – {formatDate(edu.end_date)}</p>
            </div>
          ))}
        </Section>
      )}

      {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) ? (
        <Section title="Skills">
          {skills.technical?.length > 0 && <p className="text-gray-600"><span className="text-gray-900 font-medium">Technical:</span> {skills.technical.join(", ")}</p>}
          {skills.soft?.length > 0 && <p className="text-gray-600 mt-1"><span className="text-gray-900 font-medium">Soft:</span> {skills.soft.join(", ")}</p>}
          {skills.languages?.length > 0 && <p className="text-gray-600 mt-1"><span className="text-gray-900 font-medium">Languages:</span> {skills.languages.join(", ")}</p>}
        </Section>
      ) : null}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj, i) => (
            <div key={i} className={i > 0 ? "mt-3" : ""}>
              <p className="font-semibold">{proj.name}{proj.technologies?.length > 0 && <span className="font-normal text-gray-400"> · {proj.technologies.join(", ")}</span>}</p>
              {proj.description && <p className="text-gray-600">{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert, i) => (
            <div key={i} className={`flex justify-between ${i > 0 ? "mt-1.5" : ""}`}>
              <span className="text-gray-700">{cert.name} · <span className="text-gray-400">{cert.issuer}</span></span>
              {cert.date && <span className="text-gray-400">{formatDate(cert.date)}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">{title}</h2>
      {children}
      <div className="mt-4 h-px bg-gray-100" />
    </div>
  );
}
