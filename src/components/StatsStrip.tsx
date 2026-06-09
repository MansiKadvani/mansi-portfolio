import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Code, Github } from "lucide-react";

interface StatsData {
  github: {
    username: string;
    publicRepos: number;
    totalCommits: number;
  };
  leetcode: {
    username: string;
    solved: number;
  };
}

export function StatsStrip() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/profile/stats");
        const json = await response.json();
        if (json.success && json.data) {
          setStatsData(json.data);
        }
      } catch (error) {
        console.warn("⚠️ Dynamic stats fetch failed, relying on defaults.", error);
      }
    };

    fetchStats();

    const handleUpdate = () => {
      fetchStats();
    };

    window.addEventListener("portfolio-data-updated", handleUpdate);
    return () => {
      window.removeEventListener("portfolio-data-updated", handleUpdate);
    };
  }, []);

  const leetcodeSolved = statsData?.leetcode?.solved ?? 14;
  const githubRepos = statsData?.github?.publicRepos ?? 11;

  const stats = [
    {
      value: leetcodeSolved.toString(),
      label: "LeetCode Solved Problems",
      desc: statsData?.leetcode?.username 
        ? `handle: ${statsData.leetcode.username}` 
        : "Direct API verification",
      icon: Code,
    },
    {
      value: githubRepos.toString(),
      label: "GitHub Public Repositories",
      desc: statsData?.github?.username 
        ? `handle: ${statsData.github.username}` 
        : "Live public repositories",
      icon: Github,
    },
  ];

  return (
    <div className="py-12 bg-slate-900/30 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center p-4 sm:p-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-center space-x-3 text-cyan-400 mb-2">
                <stat.icon size={22} className="stroke-[1.5]" />
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-100">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-semibold tracking-wide text-slate-300">
                {stat.label}
              </p>
              <p className="text-[10px] sm:text-xs font-mono text-slate-500 mt-1">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsStrip;
