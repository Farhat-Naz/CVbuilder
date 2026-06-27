"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Sarah Johnson", role: "Software Engineer", company: "Google", text: "CVGenerator helped me land my dream job at Google. The ATS optimization feature is incredible — my interview rate went from 5% to 40%!", avatar: "SJ", rating: 5 },
  { name: "Michael Chen", role: "Product Manager", company: "Meta", text: "The AI writing assistant saved me hours. It generated a perfect professional summary that I barely needed to edit. Highly recommend!", avatar: "MC", rating: 5 },
  { name: "Emily Rodriguez", role: "Marketing Director", company: "Startup", text: "Beautiful templates that actually pass ATS screening. I got 3 interviews in my first week using CVGenerator. Worth every penny!", avatar: "ER", rating: 5 },
  { name: "David Kim", role: "Data Scientist", company: "Amazon", text: "The cover letter generator is amazing. It personalizes each letter based on the job description. Saved me so much time.", avatar: "DK", rating: 5 },
  { name: "Lisa Park", role: "UX Designer", company: "Figma", text: "As a designer, I'm picky about visuals. CVGenerator's templates are stunning and the editor is incredibly intuitive.", avatar: "LP", rating: 5 },
  { name: "James Wilson", role: "Finance Analyst", company: "Goldman Sachs", text: "Professional, clean, and effective. My recruiter specifically complimented my resume format. CVGenerator delivered.", avatar: "JW", rating: 5 },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-heading mb-4">Loved by Job Seekers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs with CVGenerator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-blue-500/30 mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} at {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
