import { motion } from "motion/react";
import { Briefcase, Trophy, Code2, Users2, Terminal } from "lucide-react";
import { LucideIcon } from "./LucideIcon";

interface ExperienceTimelineProps {
  profile?: {
    experiences?: Array<{
      period: string;
      type: string;
      title: string;
      company: string;
      icon: string;
      highlights: string[];
    }>;
  };
}

export function ExperienceTimeline({ profile }: ExperienceTimelineProps) {
  const experiences = profile?.experiences || [];

  return (
    <section id="journey" className="py-24 bg-slate-900/10 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-20">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-900/20 border border-cyan-800/60 rounded-full px-3 py-1 text-xs font-mono font-bold text-cyan-400">
            <Terminal size={12} />
            <span>04 // CAREER_JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Timeline of Engineering Output
          </h2>
          <div className="h-1 w-12 bg-cyan-400 rounded-full" />
          <p className="max-w-xl text-xs sm:text-sm text-slate-500 font-mono">
            Track-record of shipping responsive products under timelines and team environments.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative border-l border-slate-800 max-w-3xl mx-auto pl-6 sm:pl-10 space-y-12 text-left">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              className="relative"
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Timeline dot icon container */}
              <span className="absolute -left-[39px] sm:-left-[53px] top-1 flex h-7 w-7 sm:h-9 sm:w-9 rounded-full border border-slate-800 bg-slate-950 items-center justify-center text-cyan-400 group shadow-md shadow-pink-500/5">
                <LucideIcon name={exp.icon} size={14} className="group-hover:scale-110 transition-transform" />
              </span>

              {/* Box Info Container */}
              <div className="p-5 sm:p-6 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-3 shadow-xl hover:border-cyan-500/10 hover:bg-slate-900/60 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/20 px-2 py-0.5 border border-cyan-800/40 rounded self-start">
                    {exp.period}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-medium tracking-wide uppercase">
                    {exp.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-slate-100">
                    {exp.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold font-mono text-slate-350">
                    {exp.company}
                  </p>
                </div>

                <ul className="space-y-1.5 pl-1 pt-1 text-xs">
                  {exp.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-2 text-slate-400">
                      <span className="text-cyan-400 font-mono mt-0.5">▪</span>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          {experiences.length === 0 && (
            <div className="text-sm font-mono text-slate-500 max-w-xl py-6 italic">
              // No career journey entries registered. Add internships, hackathons, or roles in the Admin Panel to display.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExperienceTimeline;
