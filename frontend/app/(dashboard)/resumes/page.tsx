"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FileText, Search, MoreHorizontal, Copy, Trash2, Pencil, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useResumes } from "@/hooks/useResumes";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResumesPage() {
  const { resumes, loading, deleteResume, duplicateResume } = useResumes();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">My Resumes</h1>
          <p className="text-muted-foreground text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/resumes/new">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />New Resume
          </Button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resumes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-2 border-dashed rounded-2xl p-16 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold text-lg mb-2">{search ? "No matching resumes" : "No resumes yet"}</h3>
          <p className="text-sm text-muted-foreground mb-6">{search ? "Try a different search term" : "Create your first professional resume to get started"}</p>
          {!search && <Link href="/resumes/new"><Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"><Plus className="mr-2 h-4 w-4" />Create Your First Resume</Button></Link>}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((resume, i) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Preview area */}
              <div className="h-40 rounded-t-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 relative overflow-hidden">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-blue-600/30 rounded" />
                  <div className="h-2 w-16 bg-muted-foreground/20 rounded" />
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-1.5 bg-muted-foreground/15 rounded" style={{ width: `${50 + j * 15}%` }} />
                  ))}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{resume.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Updated {formatDate(resume.updated_at || resume.created_at)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted focus:outline-none shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/resumes/${resume.id}`)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateResume(resume.id)}>
                        <Copy className="mr-2 h-3.5 w-3.5" />Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteResume(resume.id)}>
                        <Trash2 className="mr-2 h-3.5 w-3.5" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {resume.ats_score && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {resume.ats_score}% ATS Score
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
