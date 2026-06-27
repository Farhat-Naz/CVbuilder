"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Download, BarChart3, Palette, Globe, RefreshCw } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Writing", description: "Generate professional summaries, bullet points, and cover letters with advanced AI.", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "ATS Optimization", description: "Score and optimize your resume to pass Applicant Tracking Systems automatically.", color: "from-purple-500 to-purple-600" },
  { icon: Palette, title: "25+ Premium Templates", description: "Choose from a library of professionally designed, ATS-friendly resume templates.", color: "from-emerald-500 to-emerald-600" },
  { icon: Download, title: "Multiple Export Formats", description: "Export as PDF, DOCX, TXT, or Markdown. Print-ready formatting included.", color: "from-orange-500 to-orange-600" },
  { icon: Shield, title: "Secure & Private", description: "Your data is encrypted and never shared. Full control over your resume data.", color: "from-red-500 to-red-600" },
  { icon: BarChart3, title: "Resume Analytics", description: "Track views, downloads, and ATS scores. Know how your resume performs.", color: "from-cyan-500 to-cyan-600" },
  { icon: Globe, title: "Cover Letter Builder", description: "Generate tailored cover letters for any job with AI assistance.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Auto-Save & Sync", description: "Your work is saved automatically. Access your resumes from any device.", color: "from-indigo-500 to-indigo-600" },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-heading mb-4">Everything You Need to Get Hired</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to create, optimize, and share your resume with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-card rounded-2xl p-6 border hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold font-heading mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
