import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, Download, Inbox } from "lucide-react";

interface FloatingNavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  openAdminInbox: () => void;
  unreadCount: number;
  profile?: any;
  onOpenResume?: () => void;
}

export function FloatingNavbar({
  darkMode,
  toggleDarkMode,
  openAdminInbox,
  unreadCount,
  profile,
}: FloatingNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const handleDownloadResume = () => {
    // Triggers download on the real backend endpoint
    window.location.href = "/api/resume/download";
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(id);
    if (element) {
      const topOffset = 80; // height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-slate-950/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 shadow-md"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Developer Brand */}
          <motion.a
            href="#"
            onClick={(e) => handleScrollTo(e, "#")}
            className="flex items-center space-x-3 text-xl font-bold font-mono tracking-tight text-slate-100 dark:text-slate-100"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-500/40 shadow-sm shadow-cyan-500/20 bg-slate-900 flex-shrink-0">
              <img
                src="/src/images/portfolio.jpeg"
                alt="Professional Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="flex items-center">
              <span className="text-cyan-400">&lt;</span>
              <span>
                {profile?.heroTitle && profile.heroTitle.trim().length > 0
                  ? profile.heroTitle.trim().split(/\s+/)[0].toLowerCase()
                  : "dev"}
                .portfolio
              </span>
              <span className="text-cyan-400">/&gt;</span>
            </span>
          </motion.a>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="text-sm font-medium transition-colors text-slate-300 hover:text-cyan-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Controls: Theme Toggle, Inbox, CV Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* View Admin Inbox button */}
            <motion.button
              onClick={openAdminInbox}
              className="relative p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors cursor-pointer"
              title="Inbox Dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Inbox size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              )}
            </motion.button>

            {/* Light / Dark Mode toggle (We stay dark-first, but supporting optional light-toggle natively) */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light theme" : "Switch to Dark theme"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Resume button */}
            <motion.button
              onClick={handleDownloadResume}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg border border-cyan-500 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={13} />
              <span>Resume</span>
            </motion.button>
          </div>

          {/* Mobile responsive toggle control */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Inbox */}
            <button
              onClick={openAdminInbox}
              className="relative p-2 rounded-md text-slate-300 hover:text-cyan-400"
            >
              <Inbox size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                </span>
              )}
            </button>

            {/* Mode toggle */}
            <button onClick={toggleDarkMode} className="p-2 rounded-md text-slate-300">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu container block */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-slate-950/95 backdrop-blur-lg border-b border-slate-900 absolute top-full left-0 right-0 py-4 px-6 space-y-4 shadow-xl flex flex-col"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="text-base font-medium text-slate-300 hover:text-cyan-400 transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                handleDownloadResume();
              }}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 text-xs font-mono font-semibold uppercase rounded-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors pb-3"
            >
              <Download size={14} />
              <span>Download Resume</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default FloatingNavbar;
