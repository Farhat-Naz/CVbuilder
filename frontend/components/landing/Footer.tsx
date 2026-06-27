import Link from "next/link";
import { FileText, GitBranch, Share2, Link2 } from "lucide-react";

const links = {
  Product: ["Features", "Templates", "Pricing", "Changelog"],
  Resources: ["Blog", "Resume Tips", "Cover Letter Guide", "ATS Guide"],
  Company: ["About", "Careers", "Privacy Policy", "Terms of Service"],
  Support: ["Documentation", "FAQ", "Contact", "Status"],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-heading">
                CVGenerator
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">Build professional resumes with AI in minutes.</p>
            <div className="flex gap-3">
              {[GitBranch, Share2, Link2].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-card border flex items-center justify-center hover:border-blue-500 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CVGenerator. All rights reserved.</p>
          <p>Built with Next.js, FastAPI & ❤️</p>
        </div>
      </div>
    </footer>
  );
}
