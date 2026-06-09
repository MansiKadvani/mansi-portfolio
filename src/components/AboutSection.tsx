import { motion } from "motion/react";
import { Terminal, Award, BookOpen, BrainCircuit } from "lucide-react";

interface AboutSectionProps {
  profile?: {
    heroTitle?: string;
    aboutBioParagraphs?: string[];
    aboutMetrics?: Array<{ label: string; value: string; percentage: number }>;
    aboutTimeline?: Array<{ year: string; title: string; desc: string }>;
  };
}

export function AboutSection({ profile }: AboutSectionProps) {
  const timeline = profile?.aboutTimeline || [];
  const metrics = profile?.aboutMetrics || [];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-900/20 border border-cyan-800/60 rounded-full px-3 py-1 text-xs font-mono font-bold text-cyan-400">
            <Terminal size={12} />
            <span>01 // PROFILE_SUMMARY</span>
          </div>
          <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
Full Stack Developer building AI-powered products          </h4>
          <div className="h-1 w-12 bg-cyan-400 rounded-full" />
        </div>

        {/* Split Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column Profile Frame & Network Canvas Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between overflow-hidden group">
              {/* Abstract decorative layout */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-transparent rounded-bl-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full" />

              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-400">developer_metrics</span>
                </div>
                <BrainCircuit className="text-slate-700 group-hover:text-cyan-400 transition-colors" size={24} />
              </div>

              {/* Central Engineering Dashboard UI Grid Mock */}
              <div className="my-auto space-y-4 py-6 z-10 w-full">
                <div className="font-mono text-[11px] text-slate-500 text-left">
                  <span>$ load student_profile.json</span>
                </div>
                <div className="space-y-2 text-left">
                  {/* Visualizing dynamic metric bar units */}
                  {metrics.map((m, idx) => (
                    <div key={`${m.label}-${idx}`} className="bg-slate-950/80 border border-slate-800/60 rounded-lg p-3 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300 font-bold">{m.label}</span>
                        <span className="text-cyan-400">{m.value}</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1">
                        <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${m.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                  {metrics.length === 0 && (
                    <div className="text-[11px] font-mono text-slate-500 py-6 border border-dashed border-slate-800/80 rounded-lg p-3 text-center">
                      // No metrics configured yet. Add metrics using the Admin Workspace.
                    </div>
                  )}
                </div>
              </div>

              {/* Status details panel footer */}
              <div className="flex justify-between items-center z-10 text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-4">
                <span className="flex items-center space-x-1">
                  <Award size={10} className="text-cyan-400" />
                  <span>B.Tech CE Portfolio</span>
                </span>
                <span>learning.building.growing</span>
              </div>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-3">Projects, Skills & Development Metrics</p>
          </div>

          {/* Right Column Bio only */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
            <div className="space-y-5">
              <h3 className="text-center text-xl sm:text-xl font-bold text-slate-100">
                Hi, I'm {profile?.heroTitle || "Mansi Kadvani"}. I enjoy building scalable web applications and intelligent software systems.
              </h3>
              {profile?.aboutBioParagraphs && profile.aboutBioParagraphs.length > 0 ? (
                profile.aboutBioParagraphs.map((para: string, idx: number) => (
                  <p key={idx} className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    I am a Computer Engineering student. I do not just build 
                    frontends—I love understanding where performance degrades, optimizing database structures, 
                    implementing clean backend APIs, and designing background workers.
                  </p>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    By combining a strict, disciplined understanding of computer networks and database structures 
                    with clean, beautiful user interface craftsmanship, my projects are built like 
                    scalable software products ready for actual deployment.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Engineering Roadmap - Positioned below left and right columns */}
        <div className="mt-20 pt-16 border-t border-slate-800/60 text-left">
          <div className="space-y-10">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <BookOpen size={14} className="text-cyan-400" />
              <span>The Engineering Roadmap</span>
            </h4>

            {/* Horizontal timeline track */}
            <div className="relative">
              {/* Connected horizontal track line (visible on md screens up) */}
              <div className="absolute top-[12px] left-3 right-3 h-[1.5px] bg-slate-800/80 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
                {timeline.map((item, i) => (
                  <motion.div
                    key={`${item.year}-${i}`}
                    className="relative flex flex-col space-y-3.5"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    {/* Circle Node & Year badge */}
                    <div className="flex items-center md:flex-col md:items-start space-x-3.5 md:space-x-0 md:space-y-3 shrink-0">
                      {/* Core Glowing Dot Node */}
                      <span className="flex h-6 w-6 rounded-full border border-cyan-400/50 bg-slate-950 items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.15)] z-20">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      </span>
                      <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 rounded px-2 py-0.5">
                        {item.year}
                      </span>
                    </div>

                    {/* Milestone Details */}
                    <div className="space-y-1.5 pl-9 md:pl-0">
                      <h5 className="text-sm font-bold text-slate-200">
                        {item.title}
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {timeline.length === 0 && (
                  <div className="text-xs font-mono text-slate-500 py-4 italic w-full">
                    // No milestones added. Configure your milestones in the Admin Panel to display your roadmap.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
