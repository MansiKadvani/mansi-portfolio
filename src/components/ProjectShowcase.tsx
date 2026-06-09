import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Terminal, Star, AlertCircle, X, ChevronRight, Activity, Cpu } from "lucide-react";
import { ProjectType } from "../types";

export function ProjectShowcase() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          // Sort projects by order key
          const sorted = [...json.data].sort((a, b) => a.order - b.order);
          setProjects(sorted);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.warn("⚠️ Projects API offline.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Keyboard accessibility for modal closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-950/20 border-t border-slate-900">
      <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-900/20 border border-cyan-800/60 rounded-full px-3 py-1 text-xs font-mono font-bold text-cyan-400">
            <Terminal size={12} />
            <span>03 // PROJECT_SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Engineering Through Projects
          </h2>
          <p className="max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            A collection of full stack, AI, and scalable software projects focused on solving real-world problems.
          </p>
          <div className="h-1 w-12 bg-cyan-400 rounded-full" />
        </div>

        {/* Projects Loading State */}
        {loading ? (
          <div className="py-24 text-center font-mono text-xs text-slate-500 flex flex-col items-center space-y-3">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Retrieving portfolio data streams...</span>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-950/40 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/10">
              <Terminal size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-200">No Projects Compiled Yet</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your database is ready and clean! Navigate to <code className="text-cyan-400 font-mono bg-cyan-950/50 px-1 rounded">Admin Workspace</code> inside the top menu and enter passcode to insert your first project document into MongoDB.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Sleek Multi-Column Grid of Project Cards with Limited details */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-stretch">
            {projects.map((project, index) => {
              const displayStack = Array.isArray(project.techStack) ? project.techStack.slice(0, 3) : [];
              const hasMoreTech = Array.isArray(project.techStack) && project.techStack.length > 3;

              return (
                <motion.div
                  key={project._id || project.title || index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="flex flex-col bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 rounded-xl overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.04)] transition-all duration-300 group"
                >
                  {/* Top Image Banner */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-900/85">
                    <img
                      src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="object-cover w-full h-full opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Corner Tag */}
                    <div className="absolute top-3 left-3 flex space-x-1.5">
                      <span className="text-[9px] font-mono tracking-wider font-bold uppercase bg-slate-950/95 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                        {project.isFeatured ? "★ Featured" : "Systems"}
                      </span>
                    </div>
                  </div>

                  {/* Compact Info Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 h-[54px]">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom row: brief tech tags */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {displayStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-mono font-medium text-slate-400 bg-slate-950/50 border border-slate-800 rounded px-1.5 py-0.5"
                          >
                            {tech}
                          </span>
                        ))}
                        {hasMoreTech && (
                          <span className="text-[9px] font-mono font-medium text-slate-500 bg-slate-950/50 rounded px-1.5 py-0.5">
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Primary Action Button */}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-800/40 hover:bg-cyan-950/60 hover:border-cyan-400 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>EXPLORE SYSTEM SPECIFICATION</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Deep Specs Dialog Drawer Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
              
              {/* Overlay Backdrop close */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
              />

              {/* Centered Modal Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="relative bg-slate-950 border border-slate-800/80 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col"
              >
                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-900 transition-colors pointer-events-auto cursor-pointer"
                  title="Close Dialog (ESC)"
                >
                  <X size={16} />
                </button>

                {/* Main Content Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  
                  {/* Left Column: Big Image Display and links metadata */}
                  <div className="md:col-span-5 bg-slate-900/35 border-b md:border-b-0 md:border-r border-slate-800/60 p-6 md:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      {/* Image Frame */}
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-800 shadow-lg group">
                        <img
                          src={selectedProject.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                          alt={selectedProject.title}
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-slate-950/10 pointer-events-none" />
                      </div>

                      {/* Tech Stack List in Modal */}
                      <div className="space-y-2 text-left">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          Integrated Tech Matrix
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(selectedProject.techStack) ? selectedProject.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 rounded px-2.5 py-1"
                            >
                              {tech}
                            </span>
                          )) : null}
                        </div>
                      </div>
                    </div>

                    {/* Operational system links */}
                    <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row gap-3">
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-850 hover:text-cyan-400 text-xs font-mono font-bold text-slate-200 border border-slate-800 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Github size={14} />
                        <span>Source Code</span>
                      </a>
                      
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 inline-flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-650 text-slate-950 text-xs font-mono font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Deep-dive descriptions */}
                  <div className="md:col-span-7 p-6 md:p-8 space-y-6 text-left overflow-y-auto max-h-[80vh] md:max-h-[90vh]">
                    
                    {/* Header Details */}
                    <div className="space-y-2 border-b border-slate-800/60 pb-4">
                      <div className="flex items-center space-x-2">
                        <Activity size={14} className="text-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                          System Specifications Manual
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight leading-snug">
                        {selectedProject.title}
                      </h3>
                    </div>

                    {/* Extended description narrative */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        Operational Overview
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans font-normal">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Engineering Problem Solved Callout */}
                    <div className="bg-cyan-950/20 border-l-2 border-cyan-400 p-4 rounded-r-xl space-y-1.5">
                      <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-widest flex items-center space-x-1">
                        <AlertCircle size={12} />
                        <span>Core Problem Solved //</span>
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                        "{selectedProject.problemSolved}"
                      </p>
                    </div>

                    {/* Key Technical Features Bullet lists */}
                    {Array.isArray(selectedProject.keyFeatures) && selectedProject.keyFeatures.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          Technical Milestones & Features:
                        </h4>
                        <ul className="space-y-2 pl-0.5 text-xs sm:text-sm">
                          {selectedProject.keyFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2.5 text-slate-400">
                              <span className="text-cyan-400 font-mono mt-0.5">&gt;</span>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Advanced Engineering Challenge Resolved block */}
                    <div className="text-xs sm:text-sm border-t border-slate-800/80 pt-5 space-y-2">
                      <span className="font-mono text-[10px] text-slate-500 uppercase font-bold block">
                        Optimization Achievement / Challenge Resolved:
                      </span>
                      <p className="text-slate-400 leading-relaxed">
                        {selectedProject.engineeringChallenges}
                      </p>
                    </div>

                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

export default ProjectShowcase;
