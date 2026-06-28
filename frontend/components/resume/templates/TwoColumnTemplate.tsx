import { Resume, formatDate } from "./shared";
import { Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

export function TwoColumnTemplate({ resume }: { resume: Resume }) {
  const { full_name, email, phone, location, linkedin, portfolio, github, summary, experience = [], education = [], skills, projects = [], certifications = [] } = resume;

  return (
    <div className="bg-white text-gray-900 text-[11px] leading-relaxed font-sans min-h-[842px] flex">
      {/* Left sidebar */}
      <div className="w-[38%] bg-indigo-900 text-white flex-shrink-0 p-6">
        <div className="mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold mb-3">
            {full_name ? full_name.charAt(0).toUpperCase() : "?"}
          </div>
          <h1 className="text-lg font-bold leading-tight">{full_name || "Your Name"}</h1>
        </div>

        <div className="space-y-1.5 mb-6 text-indigo-200 text-[10px]">
          {email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 shrink-0" /><span className="break-all">{email}</span></div>}
          {phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3 shrink-0" /><span>{phone}</span></div>}
          {location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3 shrink-0" /><span>{location}</span></div>}
          {linkedin && <div className="flex items-center gap-2"><Link2 className="w-3 h-3 shrink-0" /><span className="break-all">{linkedin}</span></div>}
          {portfolio && <div className="flex items-center gap-2"><Globe className="w-3 h-3 shrink-0" /><span className="break-all">{portfolio}</span></div>}
          {github && <div className="flex items-center gap-2"><GitBranch className="w-3 h-3 shrink-0" /><span className="break-all">{github}</span></div>}
        </div>

        {(skills?.technical?.length || skills?.soft?.length || skills?.languages?.length) && (
          <div className="mb-6">
            <SideSection title="Skills">
              {skills.technical?.length > 0 && (
                <div className="mb-2">
                  <p className="text-indigo-300 text-[9px] uppercase tracking-wider mb-1">Technical</p>
                  <div className="flex flex-wrap gap-1">{skills.technical.map((s, i) => <span key={i} className="bg-indigo-700 text-indigo-100 px-1.5 py-0.5 rounded text-[9px]">{s}</span>)}</div>
                </div>
              )}
              {skills.soft?.length > 0 && (
                <div className="mb-2">
                  <p className="text-indigo-300 text-[9px] uppercase tracking-wider mb-1">Soft Skills</p>
                  <div className="flex flex-wrap gap-1">{skills.soft.map((s, i) => <span key={i} className="bg-indigo-700 text-indigo-100 px-1.5 py-0.5 rounded text-[9px]">{s}</span>)}</div>
                </div>
              )}
              {skills.languages?.length > 0 && (
                <div>
                  <p className="text-indigo-300 text-[9px] uppercase tracking-wider mb-1">Languages</p>
                  <div className="flex flex-wrap gap-1">{skills.languages.map((s, i) => <span key={i} className="bg-indigo-700 text-indigo-100 px-1.5 py-0.5 rounded text-[9px]">{s}</span>)}</div>
                </div>
              )}
            </SideSection>
          </div>
        )}

        {education.length > 0 && (
          <SideSection title="Education">
            {education.map((edu, i) => (
              <div key={i} className={i > 0 ? "mt-3" : ""}>
                <p className="font-semibold text-white">{edu.degree}</p>
                {edu.field && <p className="text-indigo-300">{edu.field}</p>}
                <p className="text-indigo-200">{edu.institution}</p>
                <p className="text-indigo-400 text-[9px]">{formatDate(edu.start_date)} – {formatDate(edu.end_date)}</p>
                {edu.gpa && <p className="text-indigo-400 text-[9px]">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <div className="mt-4">
            <SideSection title="Certifications">
              {certifications.map((cert, i) => (
                <div key={i} className={i > 0 ? "mt-2" : ""}>
                  <p className="font-medium text-white">{cert.name}</p>
                  <p className="text-indigo-300">{cert.issuer}{cert.date ? ` · ${formatDate(cert.date)}` : ""}</p>
                </div>
              ))}
            </SideSection>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-6">
        {summary && (
          <div className="mb-5">
            <MainSection title="About Me">
              <p className="text-gray-600 leading-loose">{summary}</p>
            </MainSection>
          </div>
        )}

        {experience.length > 0 && (
          <MainSection title="Work Experience">
            {experience.map((exp, i) => (
              <div key={i} className={i > 0 ? "mt-4" : ""}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{exp.position}</p>
                    <p className="text-indigo-600 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.bullets?.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5">{exp.bullets.map((b, j) => <li key={j} className="flex gap-2"><span className="text-indigo-400">•</span><span className="text-gray-700">{b}</span></li>)}</ul>
                ) : exp.description ? <p className="mt-1.5 text-gray-700">{exp.description}</p> : null}
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((proj, i) => (
              <div key={i} className={i > 0 ? "mt-3" : ""}>
                <p className="font-bold text-sm text-gray-900">{proj.name}</p>
                {proj.technologies?.length > 0 && <p className="text-indigo-500 text-[10px]">{proj.technologies.join(" · ")}</p>}
                {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[9px] font-bold uppercase tracking-widest text-indigo-300 mb-2 pb-1 border-b border-indigo-700">{title}</h2>
      {children}
    </div>
  );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2 pb-1 border-b-2 border-indigo-100">{title}</h2>
      {children}
    </div>
  );
}
