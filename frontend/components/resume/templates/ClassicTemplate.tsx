import { Resume, formatDate } from "./shared";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

export function ClassicTemplate({ resume }: { resume: Resume }) {
  const { full_name, email, phone, location, linkedin, portfolio, github, summary, experience = [], education = [], skills, projects = [], certifications = [] } = resume;

  return (
    <div className="bg-white text-gray-900 p-8 text-[11px] leading-relaxed font-sans min-h-[842px]">
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

      {summary && <Section title="Professional Summary" accent="blue"><p className="text-gray-700">{summary}</p></Section>}

      {experience.length > 0 && (
        <Section title="Work Experience" accent="blue">
          {experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-4" : ""}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{exp.position}</p>
                  <p className="text-blue-600 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                </div>
                <p className="text-gray-500 whitespace-nowrap">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
              </div>
              {exp.bullets?.length > 0 ? (
                <ul className="mt-1.5 space-y-0.5">{exp.bullets.map((b, j) => <li key={j} className="flex gap-2"><span className="text-blue-600">•</span><span className="text-gray-700">{b}</span></li>)}</ul>
              ) : exp.description ? <p className="mt-1.5 text-gray-700">{exp.description}</p> : null}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="blue">
          {education.map((edu, i) => (
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

      {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) ? (
        <Section title="Skills" accent="blue">
          <div className="space-y-1">
            {skills.technical?.length > 0 && <div className="flex gap-2"><span className="font-medium w-20 shrink-0">Technical:</span><span className="text-gray-700">{skills.technical.join(" · ")}</span></div>}
            {skills.soft?.length > 0 && <div className="flex gap-2"><span className="font-medium w-20 shrink-0">Soft Skills:</span><span className="text-gray-700">{skills.soft.join(" · ")}</span></div>}
            {skills.languages?.length > 0 && <div className="flex gap-2"><span className="font-medium w-20 shrink-0">Languages:</span><span className="text-gray-700">{skills.languages.join(" · ")}</span></div>}
          </div>
        </Section>
      ) : null}

      {projects.length > 0 && (
        <Section title="Projects" accent="blue">
          {projects.map((proj, i) => (
            <div key={i} className={i > 0 ? "mt-3" : ""}>
              <p className="font-semibold text-sm">{proj.name}{proj.technologies?.length > 0 && <span className="font-normal text-gray-500"> · {proj.technologies.join(", ")}</span>}</p>
              {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="blue">
          {certifications.map((cert, i) => (
            <div key={i} className={`flex justify-between ${i > 0 ? "mt-1.5" : ""}`}>
              <span><span className="font-medium">{cert.name}</span> · <span className="text-gray-500">{cert.issuer}</span></span>
              {cert.date && <span className="text-gray-500">{formatDate(cert.date)}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className={`text-xs font-bold uppercase tracking-widest text-${accent}-600 mb-2 pb-1 border-b border-${accent}-200`}>{title}</h2>
      {children}
    </div>
  );
}
