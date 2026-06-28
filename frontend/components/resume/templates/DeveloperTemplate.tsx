import { Resume, formatDate } from "./shared";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

export function DeveloperTemplate({ resume }: { resume: Resume }) {
  const { full_name, email, phone, location, linkedin, portfolio, github, summary, experience = [], education = [], skills, projects = [], certifications = [] } = resume;

  return (
    <div className="bg-gray-950 text-gray-100 p-8 text-[11px] leading-relaxed font-mono min-h-[842px]">
      {/* Terminal-style header */}
      <div className="mb-6 pb-4 border-b border-emerald-800">
        <div className="text-emerald-400 text-[10px] mb-1">$ whoami</div>
        <h1 className="text-2xl font-bold text-white">{full_name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-gray-400 text-[10px]">
          {email && <span className="flex items-center gap-1 text-emerald-400"><Mail className="w-2.5 h-2.5" />{email}</span>}
          {phone && <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{phone}</span>}
          {location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{location}</span>}
          {linkedin && <span className="flex items-center gap-1"><Link2 className="w-2.5 h-2.5" />{linkedin}</span>}
          {portfolio && <span className="flex items-center gap-1 text-emerald-400"><Globe className="w-2.5 h-2.5" />{portfolio}</span>}
          {github && <span className="flex items-center gap-1 text-emerald-400"><GitBranch className="w-2.5 h-2.5" />{github}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-5">
          <div className="text-emerald-400 text-[10px] mb-1">$ cat about.txt</div>
          <p className="text-gray-300 pl-2 border-l border-emerald-800">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <Section title="experience">
          {experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-4 pt-4 border-t border-gray-800" : ""}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{exp.position}</p>
                  <p className="text-emerald-400">{exp.company}{exp.location ? ` @ ${exp.location}` : ""}</p>
                </div>
                <span className="text-gray-500 text-[10px]">[{formatDate(exp.start_date)} → {exp.is_current ? "now" : formatDate(exp.end_date)}]</span>
              </div>
              {exp.bullets?.length > 0 ? (
                <ul className="mt-1.5 space-y-0.5 text-gray-300">{exp.bullets.map((b, j) => <li key={j} className="flex gap-2"><span className="text-emerald-500">›</span><span>{b}</span></li>)}</ul>
              ) : exp.description ? <p className="mt-1.5 text-gray-300">{exp.description}</p> : null}
            </div>
          ))}
        </Section>
      )}

      {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) && (
        <Section title="skills">
          {skills.technical?.length > 0 && (
            <div className="mb-2">
              <span className="text-emerald-400">const</span> <span className="text-blue-400">technical</span> <span className="text-gray-400">= [</span>
              <span className="text-yellow-300">{skills.technical.map(s => `"${s}"`).join(", ")}</span>
              <span className="text-gray-400">]</span>
            </div>
          )}
          {skills.soft?.length > 0 && (
            <div className="mb-2">
              <span className="text-emerald-400">const</span> <span className="text-blue-400">soft</span> <span className="text-gray-400">= [</span>
              <span className="text-yellow-300">{skills.soft.map(s => `"${s}"`).join(", ")}</span>
              <span className="text-gray-400">]</span>
            </div>
          )}
          {skills.languages?.length > 0 && (
            <div>
              <span className="text-emerald-400">const</span> <span className="text-blue-400">languages</span> <span className="text-gray-400">= [</span>
              <span className="text-yellow-300">{skills.languages.map(s => `"${s}"`).join(", ")}</span>
              <span className="text-gray-400">]</span>
            </div>
          )}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="projects">
          {projects.map((proj, i) => (
            <div key={i} className={i > 0 ? "mt-3" : ""}>
              <p className="text-blue-400 font-bold">{proj.name}{proj.url && <span className="text-gray-500"> → {proj.url}</span>}</p>
              {proj.technologies?.length > 0 && <p className="text-gray-500"># {proj.technologies.join(" · ")}</p>}
              {proj.description && <p className="text-gray-300 mt-0.5">{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="education">
          {education.map((edu, i) => (
            <div key={i} className={`flex justify-between ${i > 0 ? "mt-3" : ""}`}>
              <div>
                <p className="text-white font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                <p className="text-emerald-400">{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
              </div>
              <p className="text-gray-500">{formatDate(edu.start_date)}–{formatDate(edu.end_date)}</p>
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="certifications">
          {certifications.map((cert, i) => (
            <div key={i} className={`flex justify-between ${i > 0 ? "mt-1.5" : ""}`}>
              <span className="text-gray-300">{cert.name} <span className="text-gray-600">·</span> <span className="text-emerald-400">{cert.issuer}</span></span>
              {cert.date && <span className="text-gray-500">{formatDate(cert.date)}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-emerald-400 text-[10px] mb-2">$ ls {title}/</h2>
      <div className="pl-2">{children}</div>
    </div>
  );
}
