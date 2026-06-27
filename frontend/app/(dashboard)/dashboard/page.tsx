"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FileText, Mail, TrendingUp, Download, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";
import { formatDate, truncate } from "@/lib/utils";

const quickActions = [
  { label: "New Resume", icon: FileText, href: "/resumes/new", color: "from-blue-500 to-blue-600" },
  { label: "Cover Letter", icon: Mail, href: "/cover-letters", color: "from-purple-500 to-purple-600" },
  { label: "Browse Templates", icon: Sparkles, href: "/templates", color: "from-emerald-500 to-emerald-600" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { resumes, loading } = useResumes();

  const recentResumes = resumes.slice(0, 3);
  const totalDownloads = resumes.reduce((acc, r) => acc + r.download_count, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">
          Welcome back, {user?.full_name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your resume activity.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { title: "Total Resumes", value: resumes.length, icon: FileText, color: "text-blue-600" },
          { title: "Total Downloads", value: totalDownloads, icon: Download, color: "text-emerald-600" },
          { title: "Avg ATS Score", value: resumes.filter(r => r.ats_score).length ? `${Math.round(resumes.filter(r => r.ats_score).reduce((a, r) => a + (r.ats_score || 0), 0) / resumes.filter(r => r.ats_score).length)}%` : "N/A", icon: TrendingUp, color: "text-purple-600" },
          { title: "Plan", value: user?.subscription_plan?.toUpperCase() || "FREE", icon: Sparkles, color: "text-orange-600" },
        ].map((stat, i) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.title}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold font-heading mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="group relative rounded-xl border p-6 bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">{action.label}</h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Resumes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-heading">Recent Resumes</h2>
          <Link href="/resumes">
            <Button variant="ghost" size="sm" className="text-blue-600">View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : recentResumes.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No resumes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first resume to get started</p>
            <Link href="/resumes/new"><Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"><Plus className="mr-2 h-4 w-4" />Create Resume</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentResumes.map((resume) => (
              <Link key={resume.id} href={`/resumes/${resume.id}`}>
                <div className="group rounded-xl border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    {resume.ats_score && (
                      <Badge variant="secondary" className="text-xs">{resume.ats_score}% ATS</Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-sm truncate">{resume.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Updated {formatDate(resume.updated_at || resume.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
