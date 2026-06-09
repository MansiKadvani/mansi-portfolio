import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Printer, ExternalLink, Github, Linkedin, Award, AwardIcon, Briefcase, GraduationCap, Cpu, Star } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: any;
}

export function ResumeModal({ isOpen, onClose, profile }: ResumeModalProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Lock screen scroll
      document.body.style.overflow = "hidden";

      // Fetch dynamic projects and skills to render in the live Resume
      const fetchResumeData = async () => {
        try {
          const [projRes, skillRes] = await Promise.all([
            fetch("/api/projects"),
            fetch("/api/skills"),
          ]);
          const projJson = await projRes.json();
          const skillJson = await skillRes.json();

          if (projJson.success) setProjects(projJson.data || []);
          if (skillJson.success) setSkills(skillJson.data || []);
        } catch (error) {
          console.warn("⚠️ Local fallback database active for live resume view.");
        } finally {
          setLoading(false);
        }
      };

      fetchResumeData();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.location.href = "/api/resume/download";
  };

  const candidateName = "Mansi Kadvani";
  const candidateSubtitle = "B.Tech in Computer Engineering Candidate";
  const emailStr = "mrk912007@gmail.com";
  const locationStr = "Rajkot, Gujarat, India";
  const phoneStr = "+91 63********";
  const githubLink = "github.com/MansiKadvani";
  const githubUrl = "https://github.com/MansiKadvani";
  const linkedinLink = "linkedin.com/in/mansi-kadvani-01";
  const linkedinUrl = "https://linkedin.com/in/mansi-kadvani-01";
  const portfolioLink = "mansi-kadvani.vercel.app";
  const portfolioUrl = "https://mansi-kadvani.vercel.app";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          {/* Print specific stylesheet */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-resume-page, #printable-resume-page * {
                visibility: visible;
              }
              #printable-resume-page {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                background: white !important;
                color: black !important;
                box-shadow: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}} />

          {/* Modal Overlay / Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl h-full sm:h-[90vh] bg-slate-900 border border-slate-800 rounded-none sm:rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Action Bar Header (Always Visible, hidden in Print) */}
            <div className="no-print bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono text-slate-400">Terminal Resume Viewer // Confirmed Original PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 rounded text-xs font-mono transition-all cursor-pointer"
                  title="Download SDE Resume PDF"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded text-xs font-mono font-bold transition-all cursor-pointer"
                  title="Print / Save as PDF using browser pipeline"
                >
                  <Printer size={13} />
                  <span>Print CV</span>
                </button>
                <div className="h-5 w-[1px] bg-slate-800 mx-1" />
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Layout Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 text-slate-300">
              {/* Central White Paper Replica Resume (Flawless alignment matching top standards) */}
              <div
                id="printable-resume-page"
                className="mx-auto w-full max-w-[210mm] p-6 sm:p-10 bg-white text-black rounded-lg shadow-xl print:shadow-none transition-colors duration-200 text-left font-sans"
              >
                {/* 1. Header block */}
                <div className="text-center border-b border-black pb-4 mb-4">
                  <h1 className="text-3xl sm:text-4xl font-normal tracking-wide text-black text-center mb-1">
                    {candidateName}
                  </h1>

                  {/* Connect Row */}
                  <div className="mt-2 flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1 text-xs text-black">
                    <span>{phoneStr}</span>
                    <span>|</span>
                    <a href={`mailto:${emailStr}`} className="hover:underline">{emailStr}</a>
                    <span>|</span>
                    <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                    <span>|</span>
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                    <span>|</span>
                    <a href={portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
                  </div>
                </div>

                {/* 2. Education Section */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
                    Education
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                        <strong className="text-[13px] font-bold">Marwadi University</strong>
                        <span className="text-xs text-black">Rajkot, Gujarat</span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline text-xs italic text-black mt-0.5">
                        <span>Bachelor of Technology (B.Tech) in Computer Engineering</span>
                        <span className="not-italic">2025 – 2027 (Expected)</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                        <strong className="text-[13px] font-bold">Marwadi University</strong>
                        <span className="text-xs text-black">Rajkot, Gujarat</span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline text-xs italic text-black mt-0.5">
                        <span>Diploma in Computer Engineering — CGPA: 9.78 / 10.00</span>
                        <span className="not-italic">2022 – 2025</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Tech Skills */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
                    Technical Skills
                  </h3>
                  <div className="space-y-1.5 text-xs text-black">
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">Languages:</strong>
                      <span>C, JavaScript, Python</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">Frontend:</strong>
                      <span>HTML5, CSS3, Bootstrap, React.js</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">Backend:</strong>
                      <span>Node.js, Express.js, Django</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">Databases:</strong>
                      <span>MongoDB, MySQL</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">Core CS:</strong>
                      <span>Data Structures Algorithms, Object-Oriented Programming, DBMS</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">Developer Tools:</strong>
                      <span>Git, GitHub, VS Code, Postman</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1.5">
                      <strong className="font-bold">AI Data:</strong>
                      <span>Pandas, NumPy, Matplotlib, Machine Learning Fundamentals</span>
                    </div>
                  </div>
                </div>

                {/* 4. Professional engineering projects */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
                    Projects
                  </h3>
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                        <strong className="text-[13px] font-bold">
                          FixFlow <span className="text-xs font-normal italic">| React.js, Node.js, Express.js, MongoDB</span>
                        </strong>
                        <span className="text-xs text-black">2026</span>
                      </div>
                      <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs text-black text-justify">
                        <li>Developed a full-stack service management platform connecting customers, service providers, and administrators.</li>
                        <li>Designed a rule-based allocation system considering service type, availability, workload, and performance factors.</li>
                        <li>Built RESTful APIs, authentication workflows, and role-based dashboards.</li>
                        <li>Implemented scalable MongoDB database operations and backend services.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                        <strong className="text-[13px] font-bold">
                          StyleSurfer <span className="text-xs font-normal italic">| Python, Django, HTML, CSS, JavaScript, MySQL</span>
                        </strong>
                        <span className="text-xs text-black">2025</span>
                      </div>
                      <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs text-black text-justify">
                        <li>Developed a full-stack sustainable fashion rental and resale platform.</li>
                        <li>Implemented outfit rental, resale, and customization workflows for users.</li>
                        <li>Designed responsive interfaces and integrated backend database operations.</li>
                        <li>Built multi-role platform functionality supporting customers and administrators.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                        <strong className="text-[13px] font-bold">
                          CareerPulse <span className="text-xs font-normal italic">| Python, Pandas, NumPy, Matplotlib</span>
                        </strong>
                        <span className="text-xs text-black">2025</span>
                      </div>
                      <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs text-black text-justify">
                        <li>Built an AI-powered career analytics dashboard for placement prediction and skill-gap analysis.</li>
                        <li>Performed data preprocessing, visualization, and statistical analysis using Python libraries.</li>
                        <li>Generated insights related to placement probability, salary trends, and learning recommendations.</li>
                        <li>Created visual reports to support career planning and decision-making.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 5. Experience Section */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
                    Experience
                  </h3>
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                      <strong className="text-[13px] font-bold">Python Intern</strong>
                      <span className="text-xs text-black">2024</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline text-xs italic text-black mt-0.5">
                      <span>BytesBizz Technology</span>
                      <span className="not-italic">On-Site</span>
                    </div>
                    <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs text-black text-justify">
                      <li>Learned Python programming fundamentals and backend development concepts through practical assignments.</li>
                      <li>Explored Django framework for web application development and database integration.</li>
                      <li>Built mini applications and strengthened debugging, problem-solving, and software development skills.</li>
                      <li>Gained practical exposure to backend development workflows, project implementation, and collaborative development practices.</li>
                    </ul>
                  </div>
                </div>

                {/* 6. Achievements Section */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
                    Achievements
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-black text-justify">
                    <li><strong>Patent Publication</strong> – Automated Clothing Rental Kiosk (Application No. 202521070250 A), Indian Patent Office.</li>
                    <li><strong>Letter of Appreciation</strong> from Marwadi University for contribution to a published patent.</li>
                    <li><strong>Award of Excellence</strong> – Secured 1st Rank with SGPA 10 in Diploma Semester 3, 5, and 6.</li>
                    <li><strong>Completed Python Internship</strong> at BytesBizz Technology with exposure to Django and backend development.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
