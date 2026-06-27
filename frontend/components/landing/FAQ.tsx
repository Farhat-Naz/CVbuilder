"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Is CVGenerator really free?", a: "Yes! Our free plan lets you create 2 resumes and 2 cover letters with basic templates and PDF export. No credit card required." },
  { q: "Are the resumes ATS-friendly?", a: "Absolutely. All our templates are designed to pass Applicant Tracking Systems. We use clean formatting, standard fonts, and proper heading structure." },
  { q: "How does the AI resume writer work?", a: "Our AI analyzes your job title, experience, and skills to generate professional summaries, bullet points, and cover letters tailored to your target role." },
  { q: "Can I export my resume to Word/DOCX?", a: "Yes, Pro and Premium plans support PDF, DOCX, TXT, and Markdown exports. Free plan includes PDF export." },
  { q: "Is my data secure?", a: "Yes. We use industry-standard encryption, never sell your data, and you can delete your account and all associated data at any time." },
  { q: "Can I use CVGenerator on mobile?", a: "Yes! CVGenerator is fully responsive and works on mobile, tablet, and desktop devices." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Everything you need to know about CVGenerator.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open === i ? "rotate-180" : "")} />
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
