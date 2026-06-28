import { Resume, formatDate } from "./shared";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

export function ModernTemplate({ resume }: { resume: Resume }) {
  const { full_name, email, phone, location, linkedin, portfolio, github, summary, experience = [], education = [], skills, projects = [], certifications = [] } = resume;

  return (
    <div className="bg-white text-gray-900 text-[11px] leading-relaxed font-sans min-h-[842px]">
      {/* Dark header */}
      <div className="bg-slate-800 text-white px-8 py-6">
        <h1 className="text-3xl font-bold tracking-tight">{full_name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-slate-300 text-[10px]">
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
          <div className="mb-5 p-3 bg-slate-50 rounded border-l-4 border-slate-700">
            <p className="text-gray-700 italic">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp, i) => (
              <div key={i} className={i > 0 ? "mt-4" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{exp.position}</p>
                    <p className="text-slate-500 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.bullets?.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5">{exp.bullets.map((b, j) => <li key={j} className="flex gap-2"><span className="text-slate-400">▸</span><span className="text-gray-700">{b}</span></li>)}</ul>
                ) : exp.description ? <p className="mt-1.5 text-gray-700">{exp.description}</p> : null}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <div key={i} className={`flex justify-between ${i > 0 ? "mt-3" : ""}`}>
                <div>
                  <p className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-slate-500">{edu.institution}</p>
                </div>
                <div className="text-right text-gray-500">
                  <p>{formatDate(edu.start_date)} – {formatDate(edu.end_date)}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) ? (
          <Section title="Skills">
            <div className="space-y-1.5">
              {skills.technical?.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700">Technical: </span>
                  <span className="text-gray-600">{skills.technical.map((s, i) => (
                    <span key={i} className="inline-block bg-slate-100 rounded px-1.5 py-0.5 mr-1 mb-1">{s}</span>
                  ))}</span>
                </div>
              )}
              {skills.soft?.length > 0 && <div><span className="font-semibold text-slate-700">Soft: </span><span className="text-gray-600">{skills.soft.join(" · ")}</span></div>}
              {skills.languages?.length > 0 && <div><span className="font-semibold text-slate-700">Languages: </span><span className="text-gray-600">{skills.languages.join(" · ")}</span></div>}
            </div>
          </Section>
        ) : null}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((proj, i) => (
              <div key={i} className={i > 0 ? "mt-3" : ""}>
                <p className="font-bold text-sm text-slate-800">{proj.name}</p>
                {proj.technologies?.length > 0 && <p className="text-slate-500">{proj.technologies.join(" · ")}</p>}
                {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((cert, i) => (
              <div key={i} className={`flex justify-between ${i > 0 ? "mt-1.5" : ""}`}>
                <span><span className="font-medium">{cert.name}</span> · <span className="text-slate-500">{cert.issuer}</span></span>
                {cert.date && <span className="text-slate-500">{formatDate(cert.date)}</span>}
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
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2 flex items-center gap-2">
        <span className="flex-1 h-px bg-slate-200" />
        {title}
        <span className="flex-1 h-px bg-slate-200" />
      </h2>
      {children}
    </div>
  );
}
