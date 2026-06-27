"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Lock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { Template } from "@/types";
import { toast } from "sonner";

const CATEGORIES = ["All", "ATS Professional", "Modern", "Minimal", "Elegant", "Creative", "Executive", "Corporate"];

const TEMPLATE_COLORS: Record<string, string> = {
  classic: "from-blue-500 to-blue-700", modern: "from-slate-500 to-slate-700", minimal: "from-gray-400 to-gray-600",
  elegant: "from-gray-700 to-gray-900", creative: "from-pink-500 to-purple-600", executive: "from-blue-700 to-indigo-800",
  developer: "from-emerald-500 to-teal-700", designer: "from-rose-500 to-pink-700", marketing: "from-orange-500 to-red-600",
  student: "from-cyan-400 to-blue-500", internship: "from-teal-400 to-cyan-600", academic: "from-indigo-400 to-violet-600",
  corporate: "from-slate-600 to-slate-800", healthcare: "from-green-500 to-emerald-700", finance: "from-yellow-600 to-orange-600",
  engineering: "from-zinc-500 to-zinc-700", government: "from-blue-800 to-blue-950", freelancer: "from-violet-500 to-purple-700",
  remote: "from-sky-400 to-blue-600", international: "from-amber-500 to-yellow-600", "two-column": "from-blue-400 to-indigo-600",
  sidebar: "from-purple-400 to-violet-600", infographic: "from-fuchsia-500 to-pink-600", timeline: "from-cyan-500 to-blue-600",
  compact: "from-stone-400 to-stone-600",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    api.get("/templates/").then((r) => setTemplates(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = templates.filter((t) => {
    const matchCat = category === "All" || t.category === category;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Resume Templates</h1>
        <p className="text-muted-foreground text-sm mt-1">Choose from {templates.length}+ professional templates</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? "default" : "outline"}
            className={cn("h-8 text-xs", category === cat ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" : "")}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((t, i) => {
            const color = TEMPLATE_COLORS[t.id] || "from-blue-500 to-blue-700";
            const isSelected = selected === t.id;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(isSelected ? null : t.id)}
                className={cn(
                  "group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
                  isSelected ? "ring-2 ring-blue-600 border-blue-600" : ""
                )}
              >
                <div className={`h-48 bg-gradient-to-br ${color} relative`}>
                  <div className="absolute inset-3 bg-white/10 rounded-lg p-3 space-y-2">
                    <div className="h-2.5 w-20 bg-white/40 rounded" />
                    <div className="h-1.5 w-14 bg-white/25 rounded" />
                    <div className="mt-2 space-y-1">
                      {[...Array(4)].map((_, j) => <div key={j} className="h-1 bg-white/20 rounded" style={{ width: `${50 + j * 12}%` }} />)}
                    </div>
                  </div>
                  {t.is_premium && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500/90 text-yellow-950 border-0 text-[10px] px-1.5 py-0.5">
                        <Lock className="w-2 h-2 mr-0.5" />Pro
                      </Badge>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-xs truncate">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.category}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 z-50">
          <p className="text-sm font-medium">Template selected: <span className="text-blue-600">{templates.find((t) => t.id === selected)?.name}</span></p>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => { toast.success("Template applied!"); }}>
            Use Template
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
        </motion.div>
      )}
    </div>
  );
}
