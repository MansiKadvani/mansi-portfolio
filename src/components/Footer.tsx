import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  profile?: any;
}

export function Footer({ profile }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900/65 py-12 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Developer logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
            <span className="text-sm font-bold font-mono tracking-wider text-slate-100">
              {profile?.heroTitle && profile.heroTitle.trim().length > 0
                ? profile.heroTitle.trim().split(/\s+/)[0].toLowerCase()
                : "dev"}
              .portfolio<span className="text-cyan-400"></span>
            </span>
            <p className="text-[11px] font-mono text-slate-500">
             B.Tech CE Student
            </p>
          </div>


          {/* Social icons & Scroll top */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-slate-500">
              <a href={profile?.githubUsername ? `https://github.com/${profile.githubUsername}` : "https://github.com/mrk070901"} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                <Github size={16} />
              </a>
              <a href={profile?.linkedinUrl ? profile.linkedinUrl : "https://linkedin.com/in/mrk070901"} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="mailto:mrk070901@gmail.com" className="hover:text-cyan-400 transition-colors">
                <Mail size={16} />
              </a>
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />

            <button
              onClick={handleScrollToTop}
              className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-850 hover:text-cyan-400 transition-colors text-slate-400 cursor-pointer"
              title="Scroll to Top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="border-t border-slate-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[12px] font-mono text-slate-650 text-center sm:text-left">
          <span>
© 2026 Mansi Kadvani. Built with passion, code, and creativity.
          </span>
          <span className="mt-2 sm:mt-0 text-slate-500">
           Full Stack Developer • AI Explorer • B.Tech CE Student
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
