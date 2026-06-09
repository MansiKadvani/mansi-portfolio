import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  X, Lock, Inbox, AlertTriangle, Check, RefreshCw, Archive,
  User, Briefcase, Sparkles, CheckCircle2, ListFilter, Plus, Globe, Code,
  Trash2, Award
} from "lucide-react";
import { ContactProgressType, DbStatusType } from "../types";

interface AdminInboxProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUnreadCount: (count: number) => void;
}

type TabType = "inbox" | "profile" | "project" | "skill";

export function AdminInbox({ isOpen, onClose, onUpdateUnreadCount }: AdminInboxProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [customPasscode, setCustomPasscode] = useState("1234");
  const [customPasscodeHint, setCustomPasscodeHint] = useState("1234");
  const [newPasscode, setNewPasscode] = useState("");
  const [newPasscodeHint, setNewPasscodeHint] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return (sessionStorage.getItem("admin_active_tab") as TabType) || "inbox";
  });

  // Global counts and data
  const [messages, setMessages] = useState<ContactProgressType[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatusType | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  
  // Alert message system
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("admin_token") || localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_was_auth");
    setIsAuthenticated(false);
    onUpdateUnreadCount(0);
  };

  useEffect(() => {
    // Prefetch custom passcode hint and config from backend dynamically to maintain persistent reloads
    fetch("/api/profile")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          if (json.data.adminPasscodeHint) {
            setCustomPasscodeHint(json.data.adminPasscodeHint);
          }
          if (json.data.adminPasscode) {
            setCustomPasscode(json.data.adminPasscode);
          }
        }
      })
      .catch(err => console.warn("Failed to prefetch profile passcode hint:", err));

    const savedToken = sessionStorage.getItem("admin_token") || localStorage.getItem("admin_token");
    if (savedToken) {
      fetch("/api/admin/verify", {
        headers: {
          "Authorization": `Bearer ${savedToken}`
        }
      })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.authenticated) {
          setIsAuthenticated(true);
          sessionStorage.setItem("admin_was_auth", "true");
        } else {
          sessionStorage.removeItem("admin_token");
          localStorage.removeItem("admin_token");
          sessionStorage.removeItem("admin_was_auth");
          setIsAuthenticated(false);
        }
      })
      .catch(err => {
        console.warn("Verify session failed:", err);
      });
    } else {
      const wasAuth = sessionStorage.getItem("admin_was_auth");
      if (wasAuth === "true") {
        setIsAuthenticated(true);
      }
    }

    const savedMsg = sessionStorage.getItem("admin_success_message");
    if (savedMsg) {
      setSuccessMsg(savedMsg);
      sessionStorage.removeItem("admin_success_message");
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.removeItem("admin_was_open");
    sessionStorage.removeItem("admin_was_auth");
    onClose();
  };

  // --- Profile state variables ---
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroStackString, setHeroStackString] = useState("");
  const [aboutBioString, setAboutBioString] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubRepos, setGithubRepos] = useState<number>(9);
  const [githubCommits, setGithubCommits] = useState<number>(22);
  const [githubStars, setGithubStars] = useState<number>(0);
  const [githubFollowers, setGithubFollowers] = useState<number>(1);
  const [leetcodeSolved, setLeetcodeSolved] = useState<number>(14);
  const [leetcodeStreak, setLeetcodeStreak] = useState<number>(5);
  const [leetcodeBadges, setLeetcodeBadges] = useState<number>(1);
  const [aboutMetrics, setAboutMetrics] = useState<Array<{ label: string; value: string; percentage: number }>>([]);
  const [aboutTimeline, setAboutTimeline] = useState<Array<{ year: string; title: string; desc: string }>>([]);
  const [experiences, setExperiences] = useState<Array<{
    period: string;
    type: string;
    title: string;
    company: string;
    icon: string;
    highlights: string[];
  }>>([]);
  const [achievements, setAchievements] = useState<Array<{
    title: string;
    issuer: string;
    desc: string;
    icon: string;
    date: string;
  }>>([]);
  const [newAchTitle, setNewAchTitle] = useState("");
  const [newAchIssuer, setNewAchIssuer] = useState("");
  const [newAchDesc, setNewAchDesc] = useState("");
  const [newAchIcon, setNewAchIcon] = useState("Trophy");
  const [newAchDate, setNewAchDate] = useState("");

  // --- Project state variables ---
  const [projTitle, setProjTitle] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projProblemSolved, setProjProblemSolved] = useState("");
  const [projTechStack, setProjTechStack] = useState("");
  const [projKeyFeatures, setProjKeyFeatures] = useState("");
  const [projEngineeringChallenges, setProjEngineeringChallenges] = useState("");
  const [projGithubUrl, setProjGithubUrl] = useState("");
  const [projLiveUrl, setProjLiveUrl] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projIsFeatured, setProjIsFeatured] = useState(true);
  const [projOrder, setProjOrder] = useState(1);

  // --- Skill state variables ---
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState<"languages" | "frontend" | "backend" | "database" | "ai-ml" | "tools" | "core-cs">("languages");
  const [skillIconName, setSkillIconName] = useState("Code");
  const [skillIsPopular, setSkillIsPopular] = useState(false);

  // --- Projects and Skills Lists (for updating and deleting) ---
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const json = await response.json();
      if (json.success && json.data) {
        setProjectsList(json.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      const json = await response.json();
      if (json.success && json.data) {
        setSkillsList(json.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleEditProject = (p: any) => {
    setEditingProjectId(p._id);
    setProjTitle(p.title || "");
    setProjDescription(p.description || "");
    setProjProblemSolved(p.problemSolved || "");
    setProjTechStack(p.techStack ? p.techStack.join(", ") : "");
    setProjKeyFeatures(p.keyFeatures ? p.keyFeatures.join(", ") : "");
    setProjEngineeringChallenges(p.engineeringChallenges || "");
    setProjGithubUrl(p.githubUrl || "");
    setProjLiveUrl(p.liveUrl || "");
    setProjImage(p.image || "");
    setProjIsFeatured(!!p.isFeatured);
    setProjOrder(p.order || 1);
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setProjTitle("");
    setProjDescription("");
    setProjProblemSolved("");
    setProjTechStack("");
    setProjKeyFeatures("");
    setProjEngineeringChallenges("");
    setProjGithubUrl("");
    setProjLiveUrl("");
    setProjImage("");
    setProjIsFeatured(true);
    setProjOrder(1);
  };

  const handleEditSkill = (s: any) => {
    setEditingSkillId(s._id);
    setSkillName(s.name || "");
    setSkillCategory(s.category || "languages");
    setSkillIconName(s.iconName || "Code");
    setSkillIsPopular(!!s.isPopular);
  };

  const handleCancelEditSkill = () => {
    setEditingSkillId(null);
    setSkillName("");
    setSkillCategory("languages");
    setSkillIconName("Code");
    setSkillIsPopular(false);
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(`Project "${name}" was successfully deleted.`);
        window.dispatchEvent(new Event("portfolio-data-updated"));
        fetchProjects();
        if (editingProjectId === id) {
          handleCancelEditProject();
        }
      } else {
        setErrorMsg(json.error || "Failed to delete project.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error trying to delete project.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete skill "${name}"?`)) {
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(`Skill "${name}" was successfully deleted.`);
        window.dispatchEvent(new Event("portfolio-data-updated"));
        fetchSkills();
        if (editingSkillId === id) {
          handleCancelEditSkill();
        }
      } else {
        setErrorMsg(json.error || "Failed to delete skill.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error trying to delete skill.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchInboxAndProfileData = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      // 1. Fetch DB connection status
      const statusRes = await fetch("/api/health");
      const statusJson = await statusRes.json();
      if (statusJson.status === "online") {
        setDbStatus(statusJson.db);
      }

      // 2. Fetch Contact Messages
      const contactsRes = await fetch("/api/contact", {
        headers: getAuthHeaders(),
      });
      const contactsJson = await contactsRes.json();
      if (contactsJson.success && contactsJson.data) {
        setMessages(contactsJson.data);
        const unread = contactsJson.data.filter((m: any) => m.status === "unread").length;
        onUpdateUnreadCount(unread);
      } else {
        setFetchError(true);
      }

      // 3. Fetch current Profile details to pre-populate inputs
      const profileRes = await fetch("/api/profile");
      const profileJson = await profileRes.json();
      if (profileJson.success && profileJson.data) {
        const p = profileJson.data;
        setHeroTitle(p.heroTitle || "");
        setHeroSubtitle(p.heroSubtitle || "");
        setHeroDescription(p.heroDescription || "");
        setHeroStackString(Array.isArray(p.heroStackHighlights) ? p.heroStackHighlights.join(", ") : "");
        setAboutBioString(Array.isArray(p.aboutBioParagraphs) ? p.aboutBioParagraphs.join("\n\n") : "");
        setGithubUsername(p.githubUsername || "");
        setLeetcodeUsername(p.leetcodeUsername || "");
        setLinkedinUrl(p.linkedinUrl || "");
        setGithubRepos(typeof p.githubRepos === "number" ? p.githubRepos : 9);
        setGithubCommits(typeof p.githubCommits === "number" ? p.githubCommits : 22);
        setGithubStars(typeof p.githubStars === "number" ? p.githubStars : 0);
        setGithubFollowers(typeof p.githubFollowers === "number" ? p.githubFollowers : 1);
        setLeetcodeSolved(typeof p.leetcodeSolved === "number" ? p.leetcodeSolved : 14);
        setLeetcodeStreak(typeof p.leetcodeStreak === "number" ? p.leetcodeStreak : 5);
        setLeetcodeBadges(typeof p.leetcodeBadges === "number" ? p.leetcodeBadges : 1);
        setAboutMetrics(p.aboutMetrics || []);
        setAboutTimeline(p.aboutTimeline || []);
        setExperiences(p.experiences || []);
        setAchievements(p.achievements || []);
      }

      // 4. Fetch Projects list and Skills list for interactive CRUD List View
      await fetchProjects();
      await fetchSkills();
    } catch (error) {
      console.error("Error fetching admin dataset:", error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchInboxAndProfileData();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasscodeError(false);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const json = await res.json();
      if (json.success && json.token) {
        sessionStorage.setItem("admin_token", json.token);
        localStorage.setItem("admin_token", json.token);
        sessionStorage.setItem("admin_was_auth", "true");
        setIsAuthenticated(true);
        setPasscode("");
      } else {
        setPasscodeError(true);
      }
    } catch (err) {
      console.error("Login verification call failed:", err);
      setPasscodeError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = async () => {
    setRecoveryError("");
    try {
      const res = await fetch("/api/admin/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryAnswer }),
      });
      const json = await res.json();
      if (json.success && json.recoveryToken) {
        setRecoveryToken(json.recoveryToken);
        setRecoverySuccess(true);
        setRecoveryError("");
      } else {
        setRecoveryError(json.error || "Verification failed. Only registered portfolio owners can recover access.");
        setRecoverySuccess(false);
      }
    } catch (err) {
      console.error("Recovery checking failed:", err);
      setRecoveryError("Database connection issue. Unable to verify owner credentials.");
    }
  };

  const handleResetPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.length < 4) {
      setRecoveryError("New passcode must be at least 4 characters.");
      return;
    }

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recoveryToken,
          passcode: newPasscode,
          passcodeHint: newPasscodeHint.trim() || newPasscode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCustomPasscode(newPasscode);
        setCustomPasscodeHint(newPasscodeHint.trim() || newPasscode);
        setResetSuccess(true);
        setRecoveryError("");

        window.dispatchEvent(new Event("portfolio-data-updated"));

        setTimeout(() => {
          setIsForgotPassword(false);
          setRecoveryAnswer("");
          setNewPasscode("");
          setNewPasscodeHint("");
          setRecoverySuccess(false);
          setResetSuccess(false);
          setRecoveryToken("");
        }, 2000);
      } else {
        setRecoveryError(json.error || "Failed to update security passcode in server database.");
      }
    } catch (err) {
      console.error("Passcode reset network call failed:", err);
      setRecoveryError("Database connection issue. Unable to persist credentials.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "read" | "unread" | "archived") => {
    if (statusUpdating) return;
    setStatusUpdating(id);

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await response.json();
      if (json.success) {
        const updated = messages.map((m) => {
          if (m._id === id) {
            return { ...m, status: newStatus };
          }
          return m;
        });
        setMessages(updated);
        const unread = updated.filter((m) => m.status === "unread").length;
        onUpdateUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (statusUpdating) return;
    if (!window.confirm("Are you sure you want to delete this contact message?")) {
      return;
    }
    setStatusUpdating(id);

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const json = await response.json();
      if (json.success) {
        const updated = messages.filter((m) => m._id !== id);
        setMessages(updated);
        const unread = updated.filter((m) => m.status === "unread").length;
        onUpdateUnreadCount(unread);
        setSuccessMsg("Contact message deleted successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(json.error || "Failed to delete contact message.");
        setTimeout(() => setErrorMsg(null), 3000);
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      setErrorMsg("Network error trying to delete contact message.");
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setStatusUpdating(null);
    }
  };

  // Profile configuration updates
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const highlightsArray = heroStackString.split(",").map(val => val.trim()).filter(val => val !== "");
    const bioParagraphsArray = aboutBioString.split("\n\n").map(val => val.trim()).filter(val => val !== "");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          heroDescription,
          heroStackHighlights: highlightsArray,
          aboutBioParagraphs: bioParagraphsArray,
          githubUsername,
          leetcodeUsername,
          linkedinUrl,
          githubRepos: Number(githubRepos),
          githubCommits: Number(githubCommits),
          githubStars: Number(githubStars),
          githubFollowers: Number(githubFollowers),
          leetcodeSolved: Number(leetcodeSolved),
          leetcodeStreak: Number(leetcodeStreak),
          leetcodeBadges: Number(leetcodeBadges),
          aboutMetrics,
          aboutTimeline,
          experiences,
          achievements,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Profile metrics saved to MongoDB instantly!");
        window.dispatchEvent(new Event("portfolio-data-updated"));
        setTimeout(() => {
          setSuccessMsg(null);
        }, 5000);
      } else {
        setErrorMsg(json.error || "Failed to sync profile update.");
      }
    } catch (err: any) {
      console.error("Profile submit error:", err);
      setErrorMsg("Connection failure writing profile model configurations.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Adding or updating project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDescription || !projProblemSolved || !projTechStack || !projKeyFeatures || !projEngineeringChallenges || !projGithubUrl) {
      setErrorMsg("Please complete all required fields for portfolio itemization.");
      return;
    }

    setSubmitLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      title: projTitle,
      description: projDescription,
      problemSolved: projProblemSolved,
      techStack: projTechStack.split(",").map(item => item.trim()).filter(item => item !== ""),
      keyFeatures: projKeyFeatures.split(",").map(item => item.trim()).filter(item => item !== ""),
      engineeringChallenges: projEngineeringChallenges,
      githubUrl: projGithubUrl,
      liveUrl: projLiveUrl || "",
      isFeatured: projIsFeatured,
      image: projImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      order: Number(projOrder) || 1,
    };

    try {
      const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse response as JSON:", text);
        setErrorMsg(`Server returned unexpected error (Status ${res.status}): ${text.slice(0, 150)}`);
        return;
      }

      if (json.success) {
        setSuccessMsg(editingProjectId ? `Project "${projTitle}" successfully updated!` : `Project "${projTitle}" successfully added to MongoDB!`);
        window.dispatchEvent(new Event("portfolio-data-updated"));
        
        // Reset forms & state
        handleCancelEditProject();
        fetchProjects();

        setTimeout(() => {
          setSuccessMsg(null);
        }, 5000);
      } else {
        setErrorMsg(json.error || "Database rejected insert validation guidelines.");
      }
    } catch (err: any) {
      console.error("Project dispatch error:", err);
      setErrorMsg(`Internal server error. Failed to dispatch project data. Details: ${err.message || err.toString()}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Adding or updating skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName || !skillIconName) {
      setErrorMsg("Please enter skill name and Lucide icon suggestion.");
      return;
    }

    setSubmitLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      name: skillName,
      category: skillCategory,
      iconName: skillIconName,
      isPopular: skillIsPopular,
    };

    try {
      const url = editingSkillId ? `/api/skills/${editingSkillId}` : "/api/skills";
      const method = editingSkillId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse response as JSON:", text);
        setErrorMsg(`Server returned unexpected error (Status ${res.status}): ${text.slice(0, 150)}`);
        return;
      }

      if (json.success) {
        setSuccessMsg(editingSkillId ? `Skill "${skillName}" successfully updated!` : `Skill "${skillName}" saved under ${skillCategory} category!`);
        window.dispatchEvent(new Event("portfolio-data-updated"));
        
        handleCancelEditSkill();
        fetchSkills();

        setTimeout(() => {
          setSuccessMsg(null);
        }, 5000);
      } else {
        setErrorMsg(json.error || "MongoDB rejected skill document layout.");
      }
    } catch (err: any) {
      console.error("Skill dispatch error:", err);
      setErrorMsg(`Internal server error. Failed to dispatch skill data. Details: ${err.message || err.toString()}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      {/* Drawer slide-over frame */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-2xl bg-slate-950 border-l border-slate-900 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-900 bg-slate-900/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-100">
              <Inbox size={18} className="text-cyan-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                Control Hub // Admin Workspace
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider text-red-400 bg-red-900/20 hover:bg-red-900/80 border border-red-500/30 rounded inline-flex items-center space-x-1 hover:text-red-200 transition-colors cursor-pointer mr-2 uppercase"
                >
                  <Lock size={11} />
                  <span>Logout</span>
                </button>
              )}
              <button onClick={handleClose} className="p-1 rounded hover:bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Core Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-start text-left">
            {!isAuthenticated ? (
              isForgotPassword ? (
                /* Passcode Recovery Screen */
                <div className="my-auto space-y-6 max-w-sm mx-auto text-center">
                  <div className="p-3 w-12 h-12 rounded-full bg-cyan-950/40 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-800/20">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-200">Terminal Password Recovery</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Confirm developer status to retrieve or override the security passcode of this terminal.
                    </p>
                  </div>

                  {!recoverySuccess ? (
                    <div className="space-y-4 text-left">
                      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                          Security Verification Challenge:
                        </label>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          "Enter the registered administration owner email address to verify portfolio identity:"
                        </p>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                            Registered Email Address:
                          </label>
                          <input
                            type="email"
                            autoFocus
                            required
                            placeholder="e.g. administrator@example.com..."
                            value={recoveryAnswer}
                            onChange={(e) => setRecoveryAnswer(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      {recoveryError && (
                        <p className="text-xs text-red-400 font-mono text-center">
                          ✘ {recoveryError}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleRecoverPassword}
                          className="flex-1 bg-cyan-500 border border-cyan-400 text-slate-950 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-cyan-600 transition-colors"
                        >
                          Verify credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setRecoveryAnswer("");
                            setRecoveryError("");
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-800 hover:text-slate-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-lg space-y-2">
                        <p className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                          ✔ OWNER IDENTITY VERIFIED
                        </p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Authorized recovery token has been successfully signed. Please choose a new system passcode and login hint.
                        </p>
                      </div>

                      <form onSubmit={handleResetPasscode} className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg space-y-3">
                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Reset system passcode to custom key:
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Enter new passcode (min. 4 chars)..."
                            value={newPasscode}
                            onChange={(e) => setNewPasscode(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Set custom login hint to display:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. DTU entrance code, graduation year, etc."
                            value={newPasscodeHint}
                            onChange={(e) => setNewPasscodeHint(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        {resetSuccess && (
                          <div className="text-[10px] text-emerald-400 font-mono">
                            ✔ Passcode and hint successfully reset! Returning to console login...
                          </div>
                        )}
                        <button
                          type="submit"
                          className="w-full bg-emerald-500 text-slate-950 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          Reset Passcode & Hint
                        </button>
                      </form>

                      <div className="flex gap-2 text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setRecoveryAnswer("");
                            setRecoverySuccess(false);
                            setRecoveryError("");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-400 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-800 hover:text-slate-200 transition-colors"
                        >
                          Exit Recovery & Login
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Passcode Screen */
                <div className="my-auto space-y-6 max-w-sm mx-auto text-center">
                  <div className="p-3 w-12 h-12 rounded-full bg-cyan-950/40 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-800/20">
                    <Lock size={20} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-200">Unlock Engineering Dashboard</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Security lock for evaluating student full-stack operations. Enter the B.Tech assessment passcode to unlock dynamic data management.
                    </p>
                    <div className="p-1 bg-cyan-950/10 text-cyan-400 rounded text-[10px] font-mono border border-cyan-500/10 select-all inline-block px-3">
                      Passcode Hint: <code className="font-bold">
                        {customPasscodeHint ? (
                          customPasscodeHint.length <= 2 
                            ? customPasscodeHint 
                            : `${customPasscodeHint[0]}${"*".repeat(customPasscodeHint.length - 2)}${customPasscodeHint[customPasscodeHint.length - 1]}`
                        ) : "None"}
                      </code>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        System Passcode:
                      </label>
                      <input
                        type="password"
                        autoFocus
                        required
                        placeholder="••••"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full text-center bg-slate-900 border border-slate-800 rounded-lg py-2.5 text-sm tracking-widest text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    {passcodeError && (
                      <p className="text-xs text-red-400 font-mono text-center">
                        ✘ Invalid Passcode. Access Denied.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-cyan-500 border border-cyan-400 text-slate-950 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-cyan-600 transition-colors"
                    >
                      Authenticate Terminal
                    </button>
                  </form>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setPasscodeError(false);
                        setRecoverySuccess(false);
                        setRecoveryAnswer("");
                        setRecoveryError("");
                      }}
                      className="text-xs font-mono text-cyan-500/80 hover:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Forgot Passcode? [System Recovery]
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* Authenticated Workspace */
              <div className="space-y-6 flex flex-col h-full">
                

                {/* Tab select bar */}
                <div className="flex border-b border-slate-900 overflow-x-auto gap-2 py-6 scrollbar-hide">
                  <button
                    onClick={() => { setActiveTab("inbox"); setSuccessMsg(null); setErrorMsg(null); }}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                      activeTab === "inbox"
                        ? "border-cyan-500 text-cyan-405 bg-cyan-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-222"
                    }`}
                  >
                    <Inbox size={14} />
                    <span>INBOX ({messages.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("profile"); setSuccessMsg(null); setErrorMsg(null); }}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                      activeTab === "profile"
                        ? "border-cyan-500 text-cyan-405 bg-cyan-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-222"
                    }`}
                  >
                    <User size={14} />
                    <span>PROFILE</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("project"); setSuccessMsg(null); setErrorMsg(null); }}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                      activeTab === "project"
                        ? "border-cyan-500 text-cyan-405 bg-cyan-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-222"
                    }`}
                  >
                    <Briefcase size={14} />
                    <span>+ PROJECT</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("skill"); setSuccessMsg(null); setErrorMsg(null); }}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                      activeTab === "skill"
                        ? "border-cyan-500 text-cyan-405 bg-cyan-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-222"
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>+ SKILL</span>
                  </button>
                </div>

                {/* Submissions Alerts Block */}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center space-x-2.5 font-sans"
                  >
                    <CheckCircle2 size={16} className="shrink-0 animate-bounce" />
                    <div>
                      <p className="font-bold">Sync Completed Successfully</p>
                      <p className="text-[10px] text-emerald-500/90 leading-relaxed">
                        {successMsg} Page will automatically reload to show change states!
                      </p>
                    </div>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center space-x-2.5 font-sans"
                  >
                    <AlertTriangle size={16} className="shrink-0" />
                    <div>
                      <p className="font-bold">Data Write Warning</p>
                      <p className="text-[10px] text-red-550 leading-relaxed">{errorMsg}</p>
                    </div>
                  </motion.div>
                )}

                {/* Render corresponding Active Panel views */}
                <div className="flex-1 space-y-4">
                  {activeTab === "inbox" && (
                    <div className="space-y-4">
                      {/* Reload button helper */}
                      <div className="flex justify-between items-center sm:-mt-2">
                        <span className="text-xs font-bold text-slate-400 tracking-wider">
                          RECORDS LOG ({messages.length})
                        </span>
                        <button
                          onClick={fetchInboxAndProfileData}
                          disabled={loading}
                          className="flex items-center space-x-1 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 disabled:opacity-50 cursor-pointer"
                        >
                          <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
                          <span>REFRESH</span>
                        </button>
                      </div>

                      {/* Messages Container List */}
                      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                        {loading && messages.length === 0 ? (
                          <div className="py-20 text-center font-mono text-xs text-slate-500 flex flex-col items-center space-y-3">
                            <RefreshCw size={18} className="animate-spin text-cyan-400" />
                            <span>Querying backend collections...</span>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="py-20 border border-dashed border-slate-900 rounded-lg text-center text-xs text-slate-500 flex flex-col items-center space-y-3 px-6">
                            <Inbox size={20} className="text-slate-700" />
                            <span className="font-mono leading-relaxed">
                              No contacts stored inside database. Feel free to submit the contact form to trigger database creations!
                            </span>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message._id}
                              className={`border rounded-lg p-4 text-xs font-sans space-y-3 shadow transition-all ${
                                message.status === "unread"
                                  ? "bg-slate-900 border-cyan-950 shadow-cyan-900/5 hover:border-cyan-800"
                                  : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <span className="font-black text-slate-200 tracking-tight block">
                                    {message.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-505">
                                    {message.email}
                                  </span>
                                </div>
                                
                              </div>

                              {message.subject && (
                                <div className="text-[10px] font-mono text-cyan-400/90 tracking-tight">
                                  SUBJ: {message.subject}
                                </div>
                              )}

                              <p className="text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                                {message.message}
                              </p>

                              <div className="border-t border-slate-900 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                                <span>
                                  {new Date(message.createdAt).toLocaleString("en-US", {
                                    hour12: false,
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteContact(message._id)}
                                  disabled={statusUpdating === message._id}
                                  className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center gap-1 hover:bg-red-950/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                  id={`delete-cnt-${message._id}`}
                                  title="Delete contact message"
                                >
                                  <Trash2 size={11} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "profile" && (
                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Hero Name Title (e.g. Rohit Sharma)
                        </label>
                        <input
                          type="text"
                          required
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Hero Animated Role Titles (Comma-separated highlights)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MERN Stack Architect, AI-Powered Architect, DTU Senior"
                          value={heroStackString}
                          onChange={(e) => setHeroStackString(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                        <span className="text-[9px] text-slate-500 block">Separated by commas for automatic typing rotation loops.</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Hero Description Sentence
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={heroDescription}
                          onChange={(e) => setHeroDescription(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          About Me Bio Paragraphs (double-space-separated)
                        </label>
                        <textarea
                          required
                          rows={6}
                          placeholder="Paragraph 1&#10;&#10;Paragraph 2"
                          value={aboutBioString}
                          onChange={(e) => setAboutBioString(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                        />
                        <span className="text-[9px] text-slate-500 block">Provide double returns (enter keys) to break biography paragraphs.</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/your-profile"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      {/* About Metrics Editor */}
                      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">About Metrics</h3>
                          <button
                            type="button"
                            onClick={() => setAboutMetrics([...aboutMetrics, { label: "", value: "", percentage: 100 }])}
                            className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded hover:bg-cyan-900 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus size={10} />
                            <span>Add Metric</span>
                          </button>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {aboutMetrics.map((metric, idx) => (
                            <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded-lg space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => setAboutMetrics(aboutMetrics.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-[10px] font-mono font-bold cursor-pointer"
                              >
                                Remove
                              </button>
                              <div className="grid grid-cols-2 gap-2 pr-12">
                                <div>
                                  <label className="text-[8px] font-mono text-slate-400 uppercase">Label</label>
                                  <input
                                    type="text"
                                    value={metric.label}
                                    onChange={(e) => {
                                      const updated = [...aboutMetrics];
                                      updated[idx].label = e.target.value;
                                      setAboutMetrics(updated);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                    placeholder="e.g. CGPA"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] font-mono text-slate-400 uppercase">Value</label>
                                  <input
                                    type="text"
                                    value={metric.value}
                                    onChange={(e) => {
                                      const updated = [...aboutMetrics];
                                      updated[idx].value = e.target.value;
                                      setAboutMetrics(updated);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                    placeholder="e.g. 9.15/10"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[8px] font-mono text-slate-400 uppercase">Percentage (visual bar, 0-100)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={metric.percentage}
                                  onChange={(e) => {
                                    const updated = [...aboutMetrics];
                                    updated[idx].percentage = Number(e.target.value);
                                    setAboutMetrics(updated);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                  required
                                />
                              </div>
                            </div>
                          ))}
                          {aboutMetrics.length === 0 && (
                            <span className="text-[10px] text-slate-500 italic block text-center py-2">No metrics defined yet.</span>
                          )}
                        </div>
                      </div>

                      {/* About Timeline Editor */}
                      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">About Timeline</h3>
                          <button
                            type="button"
                            onClick={() => setAboutTimeline([...aboutTimeline, { year: "", title: "", desc: "" }])}
                            className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded hover:bg-cyan-900 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus size={10} />
                            <span>Add Event</span>
                          </button>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {aboutTimeline.map((item, idx) => (
                            <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded-lg space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => setAboutTimeline(aboutTimeline.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-[10px] font-mono font-bold cursor-pointer"
                              >
                                Remove
                              </button>
                              <div className="grid grid-cols-4 gap-2 pr-12">
                                <div className="col-span-1">
                                  <label className="text-[8px] font-mono text-slate-400 uppercase">Year</label>
                                  <input
                                    type="text"
                                    value={item.year}
                                    onChange={(e) => {
                                      const updated = [...aboutTimeline];
                                      updated[idx].year = e.target.value;
                                      setAboutTimeline(updated);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                    placeholder="2022"
                                    required
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="text-[8px] font-mono text-slate-400 uppercase">Title</label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                      const updated = [...aboutTimeline];
                                      updated[idx].title = e.target.value;
                                      setAboutTimeline(updated);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                    placeholder="e.g. Enrolled in B.Tech"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[8px] font-mono text-slate-400 uppercase">Description</label>
                                <input
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => {
                                    const updated = [...aboutTimeline];
                                    updated[idx].desc = e.target.value;
                                    setAboutTimeline(updated);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                  placeholder="Brief details about the accomplishment"
                                  required
                                />
                              </div>
                            </div>
                          ))}
                          {aboutTimeline.length === 0 && (
                            <span className="text-[10px] text-slate-500 italic block text-center py-2">No timeline events defined yet.</span>
                          )}
                        </div>
                      </div>

                      {/* Experiences Editor */}
                      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">Experiences & Journey</h3>
                          <button
                            type="button"
                            onClick={() => setExperiences([...experiences, { period: "", type: "Work Experience", title: "", company: "", icon: "Briefcase", highlights: [] }])}
                            className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded hover:bg-cyan-900 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Plus size={10} />
                            <span>Add Exp</span>
                          </button>
                        </div>
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                          {experiences.map((exp, idx) => {
                            const highlightsText = exp.highlights ? exp.highlights.join("\n") : "";
                            return (
                              <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 relative">
                                <button
                                  type="button"
                                  onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-[10px] font-mono font-bold cursor-pointer"
                                >
                                  Remove
                                </button>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[8px] font-mono text-slate-400 uppercase">Period</label>
                                    <input
                                      type="text"
                                      value={exp.period || ""}
                                      onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[idx].period = e.target.value;
                                        setExperiences(updated);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                      placeholder="e.g. MAY 2024 - PRESENT"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] font-mono text-slate-400 uppercase">Type</label>
                                    <select
                                      value={exp.type || "Work Experience"}
                                      onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[idx].type = e.target.value;
                                        setExperiences(updated);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                    >
                                      <option value="Work Experience">Work Experience</option>
                                      <option value="Education">Education</option>
                                      <option value="Open Source">Open Source</option>
                                      <option value="Leadership">Leadership</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[8px] font-mono text-slate-400 uppercase">Title / Role</label>
                                    <input
                                      type="text"
                                      value={exp.title || ""}
                                      onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[idx].title = e.target.value;
                                        setExperiences(updated);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                      placeholder="e.g. Software Engineer Intern"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[8px] font-mono text-slate-400 uppercase">Company / Institution</label>
                                    <input
                                      type="text"
                                      value={exp.company || ""}
                                      onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[idx].company = e.target.value;
                                        setExperiences(updated);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                      placeholder="e.g. Google Summer of Code"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[8px] font-mono text-slate-400 uppercase">Lucide Icon name</label>
                                    <select
                                      value={exp.icon || "Briefcase"}
                                      onChange={(e) => {
                                        const updated = [...experiences];
                                        updated[idx].icon = e.target.value;
                                        setExperiences(updated);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                    >
                                      <option value="Briefcase">Briefcase</option>
                                      <option value="Code">Code</option>
                                      <option value="GraduationCap">GraduationCap</option>
                                      <option value="Award">Award</option>
                                      <option value="Sparkles">Sparkles</option>
                                      <option value="Terminal">Terminal</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[8px] font-mono text-slate-400 uppercase pb-1 block">Highlights Points (one per line)</label>
                                  <textarea
                                    rows={3}
                                    value={highlightsText}
                                    onChange={(e) => {
                                      const updated = [...experiences];
                                      updated[idx].highlights = e.target.value.split("\n").map(line => line.trim()).filter(line => line !== "");
                                      setExperiences(updated);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none font-sans"
                                    placeholder="Architected async database pipelines...&#10;Mentored 4 junior engineers..."
                                    required
                                  />
                                </div>
                              </div>
                            );
                          })}
                          {experiences.length === 0 && (
                            <span className="text-[10px] text-slate-500 italic block text-center py-2">No experiences defined yet.</span>
                          )}
                        </div>
                      </div>

                      {/* Achievements Editor */}
                      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                            <Award size={11} className="text-cyan-400" />
                            <span>Dynamic Credentials & Achievements</span>
                          </h3>
                        </div>

                        {/* List current achievements */}
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {achievements.map((ach, idx) => (
                            <div key={idx} className="bg-slate-950 border border-slate-900 rounded p-2 text-xs flex justify-between items-start space-x-2">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] bg-slate-900 text-cyan-400 font-mono px-1.5 py-0.5 rounded border border-slate-800">
                                    {ach.icon}
                                  </span>
                                  <strong className="text-slate-200">{ach.title}</strong>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {ach.issuer} • {ach.date}
                                </div>
                                <p className="text-[11px] text-slate-400 font-sans mt-0.5">{ach.desc}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = achievements.filter((_, i) => i !== idx);
                                  setAchievements(updated);
                                }}
                                className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-950/30 transition-colors cursor-pointer flex-shrink-0"
                                title="Remove achievement"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                          {achievements.length === 0 && (
                            <span className="text-[10px] text-slate-500 italic block text-center py-2">No achievements added yet.</span>
                          )}
                        </div>

                        {/* Add Achievement Form Sub-section */}
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded p-2.5 mt-2 space-y-2 text-xs">
                          <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                            Add New Achievement
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[8px] font-mono uppercase text-slate-400">Title</label>
                              <input
                                type="text"
                                value={newAchTitle}
                                onChange={(e) => setNewAchTitle(e.target.value)}
                                placeholder="e.g. Winner Smart India Hackathon"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-mono uppercase text-slate-400">Issuer Agency</label>
                              <input
                                type="text"
                                value={newAchIssuer}
                                onChange={(e) => setNewAchIssuer(e.target.value)}
                                placeholder="e.g. Ministry of Education"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[8px] font-mono uppercase text-slate-400">Icon Emblem</label>
                              <select
                                value={newAchIcon}
                                onChange={(e) => setNewAchIcon(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
                              >
                                <option value="Trophy">🏆 Trophy</option>
                                <option value="BadgeCheck">🛡️ BadgeCheck</option>
                                <option value="Landmark">🏛️ Landmark</option>
                                <option value="Target">🎯 Target</option>
                                <option value="Award">🏅 Award</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-mono uppercase text-slate-400">Date/Period</label>
                              <input
                                type="text"
                                value={newAchDate}
                                onChange={(e) => setNewAchDate(e.target.value)}
                                placeholder="e.g. Dec 2024"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8px] font-mono uppercase text-slate-400">Description</label>
                            <textarea
                              rows={2}
                              value={newAchDesc}
                              onChange={(e) => setNewAchDesc(e.target.value)}
                              placeholder="Brief highlights or impact of this victory..."
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-sans"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!newAchTitle || !newAchIssuer || !newAchDesc || !newAchDate) {
                                return;
                              }
                              const item = {
                                title: newAchTitle,
                                issuer: newAchIssuer,
                                desc: newAchDesc,
                                icon: newAchIcon,
                                date: newAchDate
                              };
                              setAchievements([...achievements, item]);
                              // Reset fields
                              setNewAchTitle("");
                              setNewAchIssuer("");
                              setNewAchDesc("");
                              setNewAchDate("");
                            }}
                            className="w-full mt-1.5 py-1 px-2 text-[10px] font-mono font-bold bg-cyan-950/50 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-800/60 rounded transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Plus size={11} />
                            <span>ADD ACHIEVEMENT TO PROFILE LIST</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full bg-cyan-500 border border-cyan-400 hover:bg-cyan-600 font-mono text-xs font-bold uppercase text-slate-950 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-1"
                      >
                        {submitLoading && <RefreshCw size={12} className="animate-spin" />}
                        <span>SYNC PROFILE TO DATABASE</span>
                      </button>
                    </form>
                  )}

                  {activeTab === "project" && (
                    <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 text-xs">
                      {/* Form */}
                      <form onSubmit={handleAddProject} className="space-y-4 rounded-xl border border-slate-900 bg-slate-950/20 p-4 text-left">
                        <h4 className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
                          {editingProjectId ? "Edit Selected Project" : "Add New Project"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. SyncFlow AI"
                              value={projTitle}
                              onChange={(e) => setProjTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                Order Index
                              </label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={projOrder}
                                onChange={(e) => setProjOrder(Number(e.target.value) || 1)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Featured
                              </span>
                              <label className="inline-flex items-center space-x-2 mt-2 select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={projIsFeatured}
                                  onChange={(e) => setProjIsFeatured(e.target.checked)}
                                  className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-1 focus:ring-cyan-500 w-4 h-4"
                                />
                                <span className="text-[10px] text-slate-350 font-mono">Yes</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            Short Project Description *
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="A brief overview about what this software microservice/product is."
                            value={projDescription}
                            onChange={(e) => setProjDescription(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            The Problem Solved (AAA Interview Answer) *
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="Hiring managers look for developers targeting CPU load, latency bottlenecks..."
                            value={projProblemSolved}
                            onChange={(e) => setProjProblemSolved(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Tech Stack Highlights (Comma-separated list) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="React, Node, Express, MongoDB, WebSockets"
                              value={projTechStack}
                              onChange={(e) => setProjTechStack(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Key Core Features (Comma-separated list) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Real-time chunking, Semantic parsing, Slack hooks"
                              value={projKeyFeatures}
                              onChange={(e) => setProjKeyFeatures(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            Engineering Challenges / Optimization Achievements *
                          </label>
                          <textarea
                            required
                            rows={2}
                            placeholder="E.g., Configured background polling workers, lowering response times from 1.2s to 15ms."
                            value={projEngineeringChallenges}
                            onChange={(e) => setProjEngineeringChallenges(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Github Repository URL *
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="https://github.com/..."
                              value={projGithubUrl}
                              onChange={(e) => setProjGithubUrl(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Live Demo / Deployment URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://example.com"
                              value={projLiveUrl}
                              onChange={(e) => setProjLiveUrl(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 border border-slate-800 rounded-lg p-3 bg-slate-950/35">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-800">
                            Project Visual Asset (URL or Local Upload)
                          </label>
                          
                          <div className="space-y-3 pt-2">
                            <div>
                              <label className="text-[8px] font-mono text-slate-500 uppercase block mb-1">Option A: Paste Remote Image URL</label>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={projImage.startsWith("data:image/") ? "" : projImage}
                                onChange={(e) => setProjImage(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div className="flex items-center space-x-2 text-[9px] font-mono text-slate-500 my-1 justify-center">
                              <span className="h-px bg-slate-800/80 flex-grow" />
                              <span>OR</span>
                              <span className="h-px bg-slate-800/80 flex-grow" />
                            </div>

                            <div>
                              <label className="text-[8px] font-mono text-slate-500 uppercase block mb-1">Option B: Select image file from device</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert("Please select an image file under 2MB for optimized storage!");
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setProjImage(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-xs text-slate-400 font-mono file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-mono file:font-semibold file:bg-cyan-950/60 file:text-cyan-400 file:border-cyan-800 hover:file:bg-cyan-900 hover:file:cursor-pointer"
                              />
                            </div>

                            {projImage && (
                              <div className="pt-2 flex items-center space-x-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-left">
                                <div className="w-16 h-10 rounded overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                                  <img src={projImage} alt="Project Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[9px] font-mono text-cyan-400 block font-bold truncate">Asset loaded successfully</span>
                                  <span className="text-[8px] text-slate-500 block">
                                    {projImage.startsWith("data:") ? "Local File (Base64 data)" : "Remote web resource"}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setProjImage("")}
                                  className="text-[9px] font-mono bg-red-950/50 hover:bg-red-900 border border-red-900 text-red-400 px-1.5 py-0.5 rounded cursor-pointer shrink-0"
                                >
                                  Clear
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="flex-grow bg-cyan-500 border border-cyan-400 hover:bg-cyan-600 font-mono text-xs font-bold uppercase text-slate-950 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-1"
                          >
                            {submitLoading && <RefreshCw size={12} className="animate-spin" />}
                            <span>{editingProjectId ? "UPDATE PROJECT DOCUMENT" : "CREATE MONGODB DOCUMENT"}</span>
                          </button>
                          {editingProjectId && (
                            <button
                              type="button"
                              onClick={handleCancelEditProject}
                              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold uppercase py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Projects List View with Edit/Delete triggers */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider border-b border-slate-900 pb-2 flex items-center justify-between">
                          <span>Portfolio Projects Database ({projectsList.length})</span>
                        </h4>
                        <div className="space-y-2 text-left">
                          {projectsList.map((p) => (
                            <div key={p._id} className="bg-slate-900/40 border border-slate-800/85 rounded-lg p-3 flex justify-between items-center gap-4 text-left">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-semibold text-slate-500">#{p.order || 0}</span>
                                  <span className="text-slate-200 font-bold truncate">{p.title}</span>
                                  {p.isFeatured && (
                                    <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-1.5 py-0.5 rounded font-mono font-bold">FEATURED</span>
                                  )}
                                </div>
                                <p className="text-slate-400 text-[11px] line-clamp-1 font-sans">{p.description}</p>
                                <div className="text-[9px] font-mono text-slate-500 truncate">
                                  TECH_STACK: {p.techStack && (Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditProject(p)}
                                  className="px-2.5 py-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-950 hover:bg-cyan-950/50 rounded transition-colors cursor-pointer animate-none"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p._id, p.title)}
                                  className="p-1 text-red-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {projectsList.length === 0 && (
                            <div className="text-center py-6 text-slate-500 italic text-[11px]">No projects registered in the database.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "skill" && (
                    <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 text-xs">
                      {/* Form */}
                      <form onSubmit={handleAddSkill} className="space-y-4 rounded-xl border border-slate-900 bg-slate-950/20 p-4 text-left">
                        <h4 className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
                          {editingSkillId ? "Edit Selected Skill" : "Add New Skill"}
                        </h4>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Go, GraphQL, Kubernetes"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Category Classification
                            </label>
                            <select
                              value={skillCategory}
                              onChange={(e: any) => setSkillCategory(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              <option value="languages">Languages</option>
                              <option value="frontend">Frontend Web/Mobile</option>
                              <option value="backend">Backend & Architecture</option>
                              <option value="database">Database & Cache</option>
                              <option value="ai-ml">AI & ML Pipelines</option>
                              <option value="tools">DevOps & Cloud Tools</option>
                              <option value="core-cs">Core Computer Science</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Lucide Icon Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Server, Database, Cpu, Layers, Link2"
                              value={skillIconName}
                              onChange={(e) => setSkillIconName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                            <span className="text-[9px] text-slate-500 block">Matches any Lucide-React SVG component name.</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Popular Highlight
                          </span>
                          <label className="inline-flex items-center space-x-2 select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={skillIsPopular}
                              onChange={(e) => setSkillIsPopular(e.target.checked)}
                              className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-1 focus:ring-cyan-500 w-4 h-4"
                            />
                            <span className="text-[10px] text-slate-350 font-mono">
                              Highlight with popular border border-cyan/spark flare in grid
                            </span>
                          </label>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="flex-1 bg-cyan-500 border border-cyan-400 hover:bg-cyan-600 font-mono text-xs font-bold uppercase text-slate-950 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-1"
                          >
                            {submitLoading && <RefreshCw size={12} className="animate-spin" />}
                            <span>{editingSkillId ? "UPDATE SKILL DOCUMENT" : "INSERT SKILL TO DATABASE"}</span>
                          </button>
                          {editingSkillId && (
                            <button
                              type="button"
                              onClick={handleCancelEditSkill}
                              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold uppercase py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Skills List with Update/Delete */}
                      <div className="space-y-3 font-sans">
                        <h4 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider border-b border-slate-900 pb-2 text-left">
                          Skills Entries ({skillsList.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {skillsList.map((s) => (
                            <div key={s._id} className="bg-slate-900/40 border border-slate-800 rounded-lg p-2.5 flex justify-between items-center gap-2 text-left">
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-200 font-bold text-xs truncate">{s.name}</span>
                                  {s.isPopular && (
                                    <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-1 py-0.2 rounded font-mono font-bold">POPULAR</span>
                                  )}
                                </div>
                                <div className="text-[9px] font-mono text-slate-500 uppercase truncate">
                                  {s.category}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditSkill(s)}
                                  className="px-2 py-0.5 text-[9px] font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-950 hover:bg-cyan-950/40 rounded transition-colors cursor-pointer animate-none"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSkill(s._id, s.name)}
                                  className="p-1 text-red-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                                  title="Delete Skill"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {skillsList.length === 0 && (
                            <div className="col-span-2 text-center py-6 text-slate-500 italic text-[11px]">No skills registered in the database.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-900 pt-4 text-center">
                  <span className="text-[11px] font-mono text-slate-600">
                    Portfolio Management Console • Mansi Kadvani
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminInbox;
