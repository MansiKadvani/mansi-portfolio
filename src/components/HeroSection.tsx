// import React, { useState, useEffect } from "react";
// import { motion } from "motion/react";
// import { ArrowRight, Github, Linkedin, Mail, Star } from "lucide-react";

// // Standard Download icon imported
// import { Download } from "lucide-react";

// interface HeroSectionProps {
//   profile?: {
//     heroTitle?: string;
//     heroSubtitle?: string;
//     heroDescription?: string;
//     heroStackHighlights?: string[];
//   };
// }

// export function HeroSection({ profile }: HeroSectionProps) {
//   const roles = (profile?.heroStackHighlights && profile.heroStackHighlights.length > 0)
//     ? profile.heroStackHighlights
//     : [
//         "Computer Engineering Student",
//         "MERN Full Stack Developer",
//         "AI-Powered Systems Architect",
//         "Product-Minded Engineer"
//       ];

//   const [roleIndex, setRoleIndex] = useState(0);
//   const [currentText, setCurrentText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const typingSpeed = 100;
//   const deletingSpeed = 50;
//   const delayBetweenRoles = 2000;

//   useEffect(() => {
//     let timer: NodeJS.Timeout;

//     const handleType = () => {
//       const fullText = roles[roleIndex] || roles[0] || "";
//       if (!isDeleting) {
//         // Typing characters
//         setCurrentText(fullText.substring(0, currentText.length + 1));
//         if (currentText === fullText) {
//           timer = setTimeout(() => setIsDeleting(true), delayBetweenRoles);
//         } else {
//           timer = setTimeout(handleType, typingSpeed);
//         }
//       } else {
//         // Deleting characters
//         setCurrentText(fullText.substring(0, currentText.length - 1));
//         if (currentText === "") {
//           setIsDeleting(false);
//           setRoleIndex((prev) => (prev + 1) % roles.length);
//         } else {
//           timer = setTimeout(handleType, deletingSpeed);
//         }
//       }
//     };

//     timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);
//     return () => clearTimeout(timer);
//   }, [currentText, isDeleting, roleIndex, roles]);

//   const handleScrollToProjects = (e: React.MouseEvent) => {
//     e.preventDefault();
//     const element = document.querySelector("#projects");
//     if (element) {
//       const offset = 80;
//       const bodyRect = document.body.getBoundingClientRect().top;
//       const elementRect = element.getBoundingClientRect().top;
//       const elementPosition = elementRect - bodyRect;
//       const offsetPosition = elementPosition - offset;
//       window.scrollTo({
//         top: offsetPosition,
//         behavior: "smooth"
//       });
//     }
//   };

//   const codeSnippet = `// server/routes/contactRoutes.ts
// import { Router } from "express";
// import { submitContact } from "../controllers/contactController";

// const router = Router();

// // Validate and persist full stack feedback
// router.post("/contact", async (req, res) => {
//   const { name, email, message } = req.body;
  
//   if (!email.includes("@")) {
//     return res.status(400).json({ error: "Invalid Email" });
//   }
  
//   const saved = await db.insert({ name, email, message });
//   return res.status(201).json({ 
//     success: true, 
//     persistedId: saved._id,
//     connection: "Active MERN Connection"
//   });
// });`;

//   return (
//     <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
//       {/* Background Subtle mesh or blur effect */}
//       <div className="absolute top-[10%] left-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-cyan-500/10 blur-[90px] -z-10" />
//       <div className="absolute bottom-[10%] right-[10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-blue-600/10 blur-[80px] -z-10" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
//           {/* Left Column Text Content */}
//           <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
//             {/* Launch Status indicator */}
//             <motion.div 
//               className="inline-flex items-center space-x-2 w-auto bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 self-start text-xs font-mono font-medium text-cyan-400 cursor-default"
//               initial={{ opacity: 0, y: 15 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <span className="flex h-2 w-2 relative">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
//               </span>
//               <span>Full Stack Developer • AI Explorer</span>
//             </motion.div>

//             <div className="space-y-3">
//               <motion.h4
//                 className="text-sm font-semibold tracking-wider font-mono text-cyan-400 uppercase"
//                 initial={{ opacity: 0, y: 15 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 0.05 }}
//               >
//                 Hi, my name is
//               </motion.h4>

//               <motion.h2
//                 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//               >
//                 {profile?.heroTitle || "Computer Engineering Portfolio"}
//               </motion.h2>

//               {/* Animating subtitle placeholder */}
//               <motion.h3
//                 className="text-1xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-slate-300 min-h-[44px] flex items-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.15 }}
//               >
//                 <span className="mr-2">I am a</span>
//                 <span className="text-cyan-400 border-r-2 border-cyan-400 pr-1 animate-pulse">
//                   {currentText}
//                 </span>
//               </motion.h3>
//             </div>

//             <motion.p
//               className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               {profile?.heroDescription || "Computer Engineering senior specializing in robust full-stack architectures and AI backend integration. Solving memory bottlenecks, caching layers, and designing clean, scale-ready APIs."}
//             </motion.p>

//             {/* CTA Buttons */}
//             <motion.div
//               className="flex flex-wrap items-center gap-4 pt-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.25 }}
//             >
//               <a
//                 href="#projects"
//                 onClick={handleScrollToProjects}
//                 className="inline-flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 transition-all font-sans cursor-pointer shadow-lg shadow-cyan-500/10"
//               >
//                 <span>View Projects</span>
//                 <ArrowRight size={16} />
//               </a>

//               <a
//                 href="/api/resume/download"
//                 className="inline-flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg border border-slate-700 bg-slate-900/60 text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all font-mono cursor-pointer"
//               >
//                 <Download size={16} />
//                 <span>Download Resume</span>
//               </a>
//             </motion.div>

//             {/* Social profiles row link */}
//             <motion.div
//               className="flex items-center space-x-6 pt-6 text-slate-400"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.35 }}
//             >
//               <a
//                 href="https://github.com/MansiKadvani"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="hover:text-cyan-400 transition-colors"
//                 title="GitHub"
//               >
//                 <Github size={20} />
//               </a>
//               <a
//                 href="https://www.linkedin.com/in/mansi-kadvani-583059318/"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="hover:text-cyan-400 transition-colors"
//                 title="LinkedIn"
//               >
//                 <Linkedin size={20} />
//               </a>
//               <a
//                 href="mailto:mrk912007@gmail.com"
//                 className="hover:text-cyan-400 transition-colors"
//                 title="Mail Me"
//               >
//                 <Mail size={20} />
//               </a>
//               <div className="h-4 w-[1px] bg-slate-800" />
              
//             </motion.div>
//           </div>

//           {/* Right Column Modern Vercel-style interactive terminal visual */}
//           <motion.div
//             className="lg:col-span-5 w-full flex justify-center"
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <div className="relative w-full max-w-md bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-[11px] sm:text-xs leading-relaxed text-slate-400">
//               {/* Window controls bar */}
//               <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
//                   <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
//                   <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
//                 </div>
//                 <span className="text-slate-500 font-sans text-xs select-none">Contact API Handler | Visual Node.js v20</span>
//                 <span className="w-6" /> {/* Spacer */}
//               </div>

//               {/* Code window block */}
//               <div className="p-4 sm:p-5 text-left overflow-x-auto whitespace-pre h-[280px] sm:h-[300px] flex flex-col justify-start">
//                 <code className="text-slate-400">
//                   {codeSnippet.split("\n").map((line, i) => {
//                     // Highlights for SaaS theme
//                     if (line.startsWith("//") || line.startsWith(" *")) {
//                       return <span key={i} className="text-slate-600 block">{line}</span>;
//                     }
//                     if (line.includes("async") || line.includes("import") || line.includes("return") || line.includes("const")) {
//                       // Colorize keywords
//                       const highlighted = line
//                         .replace("import ", '<span class="text-cyan-400 font-bold">import </span>')
//                         .replace("const ", '<span class="text-cyan-400">const </span>')
//                         .replace("await ", '<span class="text-cyan-400">await </span>')
//                         .replace("return ", '<span class="text-pink-500">return </span>');
//                       return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: highlighted }} />;
//                     }
//                     return <span key={i} className="block">{line}</span>;
//                   })}
//                 </code>
//               </div>

//               {/* Console log footer status log */}
//               <div className="bg-slate-900 border-t border-slate-800 text-[10px] sm:text-[11px] px-4 py-2 flex items-center justify-between text-slate-500">
//                 <span className="text-cyan-400">⬤ MERN Stack DB Connection: Live</span>
//                 <span className="text-right">UTF-8 | TSX v4_dev</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default HeroSection;

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, Star } from "lucide-react";

// Standard Download icon imported
import { Download } from "lucide-react";

interface HeroSectionProps {
  profile?: any;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const roles = (profile?.heroStackHighlights && profile.heroStackHighlights.length > 0)
    ? profile.heroStackHighlights
    : [
        "Computer Engineering Student",
        "MERN Full Stack Developer",
        "AI-Powered Systems Architect",
        "Product-Minded Engineer"
      ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenRoles = 2000;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleType = () => {
      const fullText = roles[roleIndex] || roles[0] || "";
      if (!isDeleting) {
        // Typing characters
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), delayBetweenRoles);
        } else {
          timer = setTimeout(handleType, typingSpeed);
        }
      } else {
        // Deleting characters
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        } else {
          timer = setTimeout(handleType, deletingSpeed);
        }
      }
    };

    timer = setTimeout(handleType, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, roles]);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector("#projects");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const codeSnippet = `// server/routes/contactRoutes.ts
import { Router } from "express";
import { submitContact } from "../controllers/contactController";

const router = Router();

// Validate and persist full stack feedback
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid Email" });
  }
  
  const saved = await db.insert({ name, email, message });
  return res.status(201).json({ 
    success: true, 
    persistedId: saved._id,
    connection: "Active MERN Connection"
  });
});`;

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Subtle mesh or blur effect */}
      <div className="absolute top-[10%] left-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-cyan-500/10 blur-[90px] -z-10" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-blue-600/10 blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            {/* Launch Status indicator */}
            <motion.div 
              className="inline-flex items-center space-x-2 w-auto bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 self-start text-xs font-mono font-medium text-cyan-400 cursor-default"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>Open to Software Engineering & AI Product Internships</span>
            </motion.div>

            <div className="space-y-3">
              <motion.h4
                className="text-sm font-semibold tracking-wider font-mono text-cyan-400 uppercase"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                Hi, my name is
              </motion.h4>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {profile?.heroTitle || "Computer Engineering Portfolio"}
              </motion.h1>

              {/* Animating subtitle placeholder */}
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-300 min-h-[44px] flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <span className="mr-2">I am a</span>
                <span className="text-cyan-400 border-r-2 border-cyan-400 pr-1 animate-pulse">
                  {currentText}
                </span>
              </motion.h2>
            </div>

            <motion.p
              className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile?.heroDescription || "Computer Engineering senior specializing in robust full-stack architectures and AI backend integration. Solving memory bottlenecks, caching layers, and designing clean, scale-ready APIs."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <a
                href="#projects"
                onClick={handleScrollToProjects}
                className="inline-flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 transition-all font-sans cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                <span>View Engineering Projects</span>
                <ArrowRight size={16} />
              </a>

              <a
                href="/api/resume/download"
                className="inline-flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg border border-slate-700 bg-slate-900/60 text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all font-mono cursor-pointer"
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>
            </motion.div>

            {/* Social profiles row link */}
            <motion.div
              className="flex items-center space-x-6 pt-6 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <a
                href={profile?.githubUsername ? `https://github.com/${profile.githubUsername}` : "https://github.com/mrk070901"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={profile?.linkedinUrl ? profile.linkedinUrl : "https://linkedin.com/in/mrk070901"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:mrk070901@gmail.com"
                className="hover:text-cyan-400 transition-colors"
                title="Mail Me"
              >
                <Mail size={20} />
              </a>
             
              
            </motion.div>
          </div>

          {/* Right Column Modern Vercel-style interactive terminal visual */}
          <motion.div
            className="lg:col-span-5 w-full flex justify-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-[11px] sm:text-xs leading-relaxed text-slate-400">
              {/* Window controls bar */}
              <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-500 font-sans text-xs select-none">Contact API Handler | Visual Node.js v20</span>
                <span className="w-6" /> {/* Spacer */}
              </div>

              {/* Code window block */}
              <div className="p-4 sm:p-5 text-left overflow-x-auto whitespace-pre h-[280px] sm:h-[300px] flex flex-col justify-start">
                <code className="text-slate-400">
                  {codeSnippet.split("\n").map((line, i) => {
                    // Highlights for SaaS theme
                    if (line.startsWith("//") || line.startsWith(" *")) {
                      return <span key={i} className="text-slate-600 block">{line}</span>;
                    }
                    if (line.includes("async") || line.includes("import") || line.includes("return") || line.includes("const")) {
                      // Colorize keywords
                      const highlighted = line
                        .replace("import ", '<span class="text-cyan-400 font-bold">import </span>')
                        .replace("const ", '<span class="text-cyan-400">const </span>')
                        .replace("await ", '<span class="text-cyan-400">await </span>')
                        .replace("return ", '<span class="text-pink-500">return </span>');
                      return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: highlighted }} />;
                    }
                    return <span key={i} className="block">{line}</span>;
                  })}
                </code>
              </div>

              {/* Console log footer status log */}
              <div className="bg-slate-900 border-t border-slate-800 text-[10px] sm:text-[11px] px-4 py-2 flex items-center justify-between text-slate-500">
                <span className="text-cyan-400">⬤ MERN Stack DB Connection: Live</span>
                <span className="text-right">UTF-8 | TSX v4_dev</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
