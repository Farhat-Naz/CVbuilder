"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { PersonalInfoStep } from "@/components/resume/steps/PersonalInfoStep";
import { SummaryStep } from "@/components/resume/steps/SummaryStep";
import { ExperienceStep } from "@/components/resume/steps/ExperienceStep";
import { EducationStep } from "@/components/resume/steps/EducationStep";
import { SkillsStep } from "@/components/resume/steps/SkillsStep";
import { ProjectsStep } from "@/components/resume/steps/ProjectsStep";
import { CertificationsStep } from "@/components/resume/steps/CertificationsStep";
import { resumeService } from "@/services/resume.service";
import { Resume } from "@/types";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { downloadResumeAsPDF } from "@/lib/pdf";

const STEPS = [
  { id: "personal", title: "Personal Info", description: "Your contact details" },
  { id: "summary", title: "Summary", description: "Professional overview" },
  { id: "experience", title: "Experience", description: "Work history" },
  { id: "education", title: "Education", description: "Academic background" },
  { id: "skills", title: "Skills", description: "Your expertise" },
  { id: "projects", title: "Projects", description: "Notable work" },
  { id: "certifications", title: "Certifications", description: "Credentials" },
];

const defaultResume: Partial<Resume> = {
  title: "My Resume",
  template_id: "classic",
  full_name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  github: "",
  summary: "",
  experience: [],
  education: [],
  skills: { technical: [], soft: [], languages: [] },
  projects: [],
  certifications: [],
  achievements: [],
  references: [],
};

function NewResumePageInner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<Partial<Resume>>(defaultResume);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const templateId = searchParams.get("template");
    if (templateId) updateResume({ template_id: templateId });
  }, []);

  const updateResume = useCallback((updates: Partial<Resume>) => {
    setResumeData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setShowPreview(true);
      await new Promise((r) => setTimeout(r, 300));
      await downloadResumeAsPDF("resume-preview", resumeData.full_name || "resume");
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const saved = await resumeService.create(resumeData);
      toast.success("Resume saved!");
      router.push(`/resumes/${saved.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const stepComponents = [
    <PersonalInfoStep key="personal" data={resumeData} onChange={updateResume} />,
    <SummaryStep key="summary" data={resumeData} onChange={updateResume} />,
    <ExperienceStep key="experience" data={resumeData} onChange={updateResume} />,
    <EducationStep key="education" data={resumeData} onChange={updateResume} />,
    <SkillsStep key="skills" data={resumeData} onChange={updateResume} />,
    <ProjectsStep key="projects" data={resumeData} onChange={updateResume} />,
    <CertificationsStep key="certifications" data={resumeData} onChange={updateResume} />,
  ];

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Create New Resume</h1>
          <p className="text-muted-foreground text-sm">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />{showPreview ? "Hide" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
            <Download className="mr-2 h-4 w-4" />{downloading ? "Generating..." : "Download PDF"}
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-3 overflow-x-auto gap-2">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(i)}
              className={`flex flex-col items-center text-xs transition-colors min-w-[60px] ${
                i === currentStep ? "text-blue-600 font-medium" : i < currentStep ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 border-2 transition-all ${
                i === currentStep ? "border-blue-600 bg-blue-600 text-white" :
                i < currentStep ? "border-emerald-500 bg-emerald-500 text-white" :
                "border-muted-foreground/30 text-muted-foreground"
              }`}>
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className="hidden sm:block">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" />Previous
            </Button>
            {currentStep === STEPS.length - 1 ? (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Resume"}
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}>
                Next<ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className={`${showPreview ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-4">
            <ResumePreview id="resume-preview" resume={resumeData as Resume} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewResumePage() {
  return (
    <Suspense>
      <NewResumePageInner />
    </Suspense>
  );
}
