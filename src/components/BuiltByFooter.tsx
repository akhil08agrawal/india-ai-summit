import { Linkedin, Globe, Twitter, Mail } from "lucide-react";

export default function BuiltByFooter() {
  return (
    <footer className="w-full border-t border-border mt-12 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Built with <span className="text-red-400">♥</span> by{" "}
          <span className="font-heading font-semibold text-foreground">Akhil Agrawal</span>
        </p>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/akhil08/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="https://x.com/AkhilAgrawal08" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Twitter / X">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="https://akhil.theimperfectpm.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Personal Website">
            <Globe className="w-4 h-4" />
          </a>
          <a href="mailto:akhil08.iitkgp@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" title="Email">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
