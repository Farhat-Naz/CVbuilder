import Link from "next/link";
import { FileText } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - branding */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          CVGenerator
        </Link>
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <h2 className="text-4xl font-bold font-heading mb-4 leading-tight">
            Build Your Dream Career with AI
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 10,000+ professionals who've landed jobs with CVGenerator.
          </p>
          <div className="space-y-3">
            {["ATS-optimized templates", "AI-powered content generation", "One-click PDF export", "Cover letter builder"].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-sm relative z-10">© 2025 CVGenerator. All rights reserved.</p>
      </div>

      {/* Right side - form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CVGenerator</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
