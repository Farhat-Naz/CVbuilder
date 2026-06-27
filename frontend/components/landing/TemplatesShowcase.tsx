"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";

const templates = [
  { id: "classic", name: "Classic Professional", category: "ATS Professional", isPremium: false, color: "from-blue-500 to-blue-700" },
  { id: "modern", name: "Modern Clean", category: "Modern", isPremium: false, color: "from-slate-500 to-slate-700" },
  { id: "minimal", name: "Minimal White", category: "Minimal", isPremium: false, color: "from-gray-400 to-gray-600" },
  { id: "elegant", name: "Elegant Dark", category: "Elegant", isPremium: true, color: "from-gray-700 to-gray-900" },
  { id: "creative", name: "Creative Colorful", category: "Creative", isPremium: true, color: "from-pink-500 to-purple-600" },
  { id: "executive", name: "Executive Blue", category: "Executive", isPremium: true, color: "from-blue-700 to-indigo-800" },
];

export function TemplatesShowcase() {
  return (
    <section id="templates" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-heading mb-4">25+ Premium Templates</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional designs for every industry and career level.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Template preview */}
              <div className={`h-64 bg-gradient-to-br ${t.color} relative`}>
                <div className="absolute inset-4 bg-white/10 rounded-lg">
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-24 bg-white/30 rounded" />
                    <div className="h-2 w-16 bg-white/20 rounded" />
                    <div className="mt-3 space-y-1">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-1.5 bg-white/20 rounded" style={{ width: `${60 + j * 10}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
                {t.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500/90 text-yellow-950 border-0 text-xs font-semibold">
                      <Lock className="w-2.5 h-2.5 mr-1" />Pro
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold font-heading text-sm">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
              Browse All Templates
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
