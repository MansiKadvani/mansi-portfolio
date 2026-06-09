import { useState, useEffect } from "react";
import { FloatingNavbar } from "./components/FloatingNavbar";
import { HeroSection } from "./components/HeroSection";
import { StatsStrip } from "./components/StatsStrip";
import { AboutSection } from "./components/AboutSection";
import { SkillsGrid } from "./components/SkillsGrid";
import { ProjectShowcase } from "./components/ProjectShowcase";
import { GithubLeetcodeSection } from "./components/GithubLeetcodeSection";
import { AchievementsGrid } from "./components/AchievementsGrid";
import { ContactForm } from "./components/ContactForm";
import { AdminInbox } from "./components/AdminInbox";
import { Footer } from "./components/Footer";
import { ResumeModal } from "./components/ResumeModal";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isInboxOpen, setIsInboxOpen] = useState(() => {
    const wasOpen = sessionStorage.getItem("admin_was_open");
    if (wasOpen === "true") {
      sessionStorage.removeItem("admin_was_open");
      return true;
    }
    return false;
  });
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  // Sync with actual backend messages to get unread count
  useEffect(() => {
    const fetchUnreadStatus = async () => {
      try {
        const response = await fetch("/api/contact");
        const json = await response.json();
        if (json.success && json.data) {
          const unread = json.data.filter((m: any) => m.status === "unread").length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.warn("⚠️ API offline, unable to sync live unread indicators.");
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const json = await response.json();
        if (json.success && json.data) {
          setProfile(json.data);
        }
      } catch (error) {
        console.warn("⚠️ Profile API offline, falling back to client defaults.");
      }
    };

    fetchUnreadStatus();
    fetchProfile();

    const handleUpdate = () => {
      fetchUnreadStatus();
      fetchProfile();
    };

    window.addEventListener("portfolio-data-updated", handleUpdate);
    return () => {
      window.removeEventListener("portfolio-data-updated", handleUpdate);
    };
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleOpenInbox = () => {
    setIsInboxOpen(true);
  };

  const handleCloseInbox = () => {
    setIsInboxOpen(false);
  };

  const handleUpdateUnread = (count: number) => {
    setUnreadCount(count);
  };

  const handleOpenResume = () => {
    setIsResumeOpen(true);
  };

  const handleCloseResume = () => {
    setIsResumeOpen(false);
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 overflow-x-hidden ${
        darkMode ? "bg-[#0F172A] text-slate-100 dark" : "bg-[#F8FAFC] text-slate-900 light"
      }`}
    >
      {/* Dynamic Background Noise/Shader for SaaS Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Sticky Top Floating Glass Navbar */}
      <FloatingNavbar
        darkMode={darkMode}
        toggleDarkMode={handleToggleDarkMode}
        openAdminInbox={handleOpenInbox}
        unreadCount={unreadCount}
        profile={profile}
        onOpenResume={handleOpenResume}
      />

      {/* Main Structural Layout Sections */}
      <main className="relative">
        <HeroSection profile={profile} onOpenResume={handleOpenResume} />
        
        <StatsStrip />
        
        <AboutSection profile={profile} />
        
        <SkillsGrid />
        
        <ProjectShowcase />
        
        <GithubLeetcodeSection />
        
        <AchievementsGrid profile={profile} />
        
        <ContactForm profile={profile} />
      </main>

      {/* Live Admin Slide Drawer Panel */}
      <AdminInbox
        isOpen={isInboxOpen}
        onClose={handleCloseInbox}
        onUpdateUnreadCount={handleUpdateUnread}
      />

      {/* Interactive Resume Modal Canvas (Printable + Download PDF) */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={handleCloseResume}
        profile={profile}
      />

      {/* Minimal Footer Credits */}
      <Footer profile={profile} />
    </div>
  );
}
