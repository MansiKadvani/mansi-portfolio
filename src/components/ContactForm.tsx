import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Linkedin, Github, MapPin, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface StatusToast {
  type: "success" | "error";
  message: string;
}

interface ContactFormProps {
  profile?: any;
}

export function ContactForm({ profile }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<StatusToast | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Core Front-End Checks
    if (!name.trim()) {
      showToast("error", "Name is a required field.");
      return;
    }
    if (!email.trim()) {
      showToast("error", "Email is a required field.");
      return;
    }
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mailRegex.test(email)) {
      showToast("error", "Please input a valid email address.");
      return;
    }
    if (!message.trim()) {
      showToast("error", "Message content is a required field.");
      return;
    }
    if (message.trim().length < 10) {
      showToast("error", "Message must be at least 10 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });

      const responseJson = await response.json();

      if (responseJson.success) {
        showToast("success", "Message received! The portfolio owner will get back to you shortly.");
        // Reset States
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        showToast("error", responseJson.error || "Submission failed. Please check inputs.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      showToast("error", "Unable to establish network connection to API router.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-900/20 border border-cyan-800/60 rounded-full px-3 py-1 text-xs font-mono font-bold text-cyan-400">
            <Mail size={12} />
            <span>06 // CONCURRENT_FEEDBACK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
           Let’s Connect & Build Together
          </h2>
          
          <p className="max-w-xl text-xs sm:text-sm text-slate-500 font-mono">
            Open to internships, software engineering opportunities, collaborations, and innovative projects.
          </p>
          <div className="h-1 w-12 bg-cyan-400 rounded-full" />
        </div>

        {/* Contact Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Left Block Cards Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 sm:p-8 space-y-6 text-left shadow-lg">
              <h3 className="text-lg font-bold text-slate-100 font-sans">Contact Information</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hiring coordinator or engineering manager? Shoot in a quick message to consult 
                intern availability, source references, or invite for direct SDE opportunities.
              </p>

              {/* Direct elements */}
              <div className="space-y-4 font-mono text-xs sm:text-sm">
                <div className="flex items-center space-x-3.5 text-slate-300">
                  <div className="p-2 rounded bg-slate-950 text-cyan-400">
                    <Mail size={14} />
                  </div>
                  <span>mrk912007@gmail.com</span>
                </div>

                <div className="flex items-center space-x-3.5 text-slate-300">
                  <div className="p-2 rounded bg-slate-950 text-cyan-400">
                    <MapPin size={14} />
                  </div>
                  <span>Dhrangadhra , Gujrat</span>
                </div>
              </div>

              {/* Social Anchors */}
              <div className="pt-4 border-t border-slate-900 flex items-center space-x-4">
                <a
                  href={profile?.linkedinUrl ? profile.linkedinUrl : "https://linkedin.com/in/mrk070901"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-950 border border-slate-900 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin size={12} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profile?.githubUsername ? `https://github.com/${profile?.githubUsername}` : "https://github.com/mrk070901"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-950 border border-slate-900 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Github size={12} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column Form Segment */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-sans text-slate-200 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hiring@company.com"
                    className="w-full bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-sans text-slate-200 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                  Subject Line / Topic
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Opportunity: Software Engineering Intern SDE"
                  className="w-full bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-sans text-slate-200 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                  Message Content * (Minimum 10 chars)
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your engineering needs or SDE opportunities..."
                  className="w-full bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-sans text-slate-200 outline-none transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                id="submit"
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center space-x-2 px-6 py-3 text-xs font-mono font-bold uppercase rounded-lg cursor-pointer transition-all border ${
                  loading
                    ? "bg-slate-900 border-slate-850 text-slate-500"
                    : "bg-cyan-500 border-cyan-400 text-slate-950 hover:bg-cyan-600 shadow-md shadow-cyan-500/10"
                }`}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Transmitting Payload...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Dispatch Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4.5 py-3.5 rounded-lg border shadow-xl max-w-sm text-left backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/90 border-red-500/40 text-red-300"
            }`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-red-400" />
            )}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ContactForm;
