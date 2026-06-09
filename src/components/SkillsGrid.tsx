import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Terminal, Sparkles, Server, Database, Library, Settings, Code } from "lucide-react";
import { SkillType } from "../types";
import LucideIcon from "./LucideIcon";

const CATEGORY_MAP = {
  all: "All Skills",
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  database: "Databases & Cache",
  "ai-ml": "AI / ML",
  tools: "Tools & DevOps",
  "core-cs": "Core CS Foundations",
};

type FilterCategoryType = "all" | keyof typeof CATEGORY_MAP;

export function SkillsGrid() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategoryType>("all");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setSkills(json.data);
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.warn("⚠️ Skills backend API offline.");
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Filter skills based on selected category tab
  const filteredSkills = selectedCategory === "all"
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  // Group dynamic statistics
  const categoryCounts = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularSkillsCount = skills.filter(s => s.isPopular).length;

  return (
    <section id="skills" className=" bg-slate-900/10 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-900/20 border border-cyan-800/60 rounded-full px-3 py-1 text-xs font-mono font-bold text-cyan-400">
            <Server size={12} />
            <span>02 // SKILL_MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Technical Skills & Expertise
          </h2>
          <p className="text-sm font-sans text-slate-400 max-w-xl">
            Focused on full stack development, backend engineering, databases, and AI-powered applications.
          </p>
          <div className="h-1 w-12 bg-cyan-400 rounded-full mt-1" />
        </div>

        {/* Loading and Empty States */}
        {loading ? (
          <div className="py-24 text-center font-mono text-xs text-slate-500 flex flex-col items-center space-y-3">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to skill matrices database...</span>
          </div>
        ) : skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-lg mb-12"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-950/40 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/10">
              <Cpu size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-200">No Skills Logged Yet</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your skill matrix database is clean and empty! Navigate to <code className="text-cyan-400 font-mono bg-cyan-950/50 px-1 rounded">Admin Workspace</code> inside the top menu and enter passcode to add custom skills grouped into languages, database systems, core CS domains, and frontend frameworks.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-16">
            <div className="relative min-h-[300px] space-y-16">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/[0.02] blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.02] blur-3xl rounded-full pointer-events-none" />

              {Object.entries(CATEGORY_MAP).map(([key, label], catIndex) => {
                if (key === "all") return null;
                const catSkills = skills.filter((s) => s.category === key);
                if (catSkills.length === 0) return null;

                return (
                  <div key={key} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
                    {/* Left Column Category Labeled Block */}
                    <div className="lg:col-span-3 border-l-2 border-cyan-500/50 pl-4 py-1 text-left">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 block mb-1">
                        02.{String(catIndex).padStart(2, "0")} 
                      </span>
                      <h3 className="text-lg font-bold text-slate-150 tracking-tight uppercase">
                        {label}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">
                        {catSkills.length} active {catSkills.length === 1 ? 'competence' : 'competences'}
                      </p>
                    </div>

                    {/* Right Column Skills Grid belonging to this Category */}
                    <div className="lg:col-span-9">
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 items-stretch">
                        {catSkills.map((skill) => {
                          const isCorePopular = skill.isPopular;
                          return (
                            <motion.div
                              key={skill._id || skill.name}
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              whileHover={{ y: -3, scale: 1.015 }}
                              transition={{ duration: 0.25 }}
                              className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all relative overflow-hidden group ${
                                isCorePopular
                                  ? "bg-slate-900/80 border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
                              }`}
                            >
                              {/* Background subtle visual elements */}
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />

                              <div className="space-y-3.5 z-10">
                                {/* Top row with Icon & highlight badge if Daily Driver */}
                                <div className="flex items-start justify-between">
                                  <div className={`p-2 rounded-lg ${
                                    isCorePopular 
                                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                                      : "bg-slate-950/60 text-slate-300 border border-slate-800/60"
                                  }`}>
                                    <LucideIcon name={skill.iconName} size={15} className="stroke-[1.8]" />
                                  </div>

                                  {isCorePopular && (
                                    <span className="text-[8px] font-mono font-bold tracking-widest text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 border border-cyan-500/20 rounded uppercase animate-pulse">
                                      Daily Driver
                                    </span>
                                  )}
                                </div>

                                {/* Skill details */}
                                <div className="space-y-1">
                                  <h4 className="text-sm font-bold font-sans text-slate-100 tracking-wide uppercase">
                                    {skill.name}
                                  </h4>
                                </div>
                              </div>

                              
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            
          </div>
        )}
      </div>
    </section>
  );
}

export default SkillsGrid;
