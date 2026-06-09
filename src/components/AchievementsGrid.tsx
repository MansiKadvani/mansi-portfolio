import { motion } from "motion/react";
import { BadgeCheck, Trophy, Landmark, Target, Award } from "lucide-react";

const iconMap: Record<string, any> = {
  BadgeCheck,
  Trophy,
  Landmark,
  Target,
  Award
};

export function AchievementsGrid({ profile }: { profile?: any }) {

  const list = profile?.achievements || [];

  return (
    <section className="py-10 bg-slate-900/10 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1.5 bg-cyan-900/20 border border-cyan-800/60 rounded-full px-3 py-1 text-xs font-mono font-bold text-cyan-400">
            <Award size={12} />
            <span>05 // CERTIFIED_MILESTONES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Awards & Achievements
          </h2>
          <p className="max-w-xl text-xs sm:text-sm text-slate-500 font-mono">
            Recognitions, academic accomplishments, and innovation milestones achieved during my learning and development journey.
          </p>
          <div className="h-1 w-12 bg-cyan-400 rounded-full" />
        </div>

        {list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-950/40 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/10">
              <Award size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-200">No Achievements Documented Yet</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Your database is ready and clean! Press <code className="text-cyan-400 font-mono bg-cyan-950/50 px-1 rounded">Admin Workspace</code> in the navbar and authenticate (Passcode: <code className="text-cyan-400">1234</code>) to insert your first verified credential into your profile.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Dynamic Bento Box Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-left">
            {list.map((item: any, i: number) => {
              const IconComponent = typeof item.icon === "string" 
                ? (iconMap[item.icon] || Award)
                : (item.icon || Award);

              return (
                <motion.div
                  key={`${item.title}-${i}`}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between hover:border-cyan-500/10 hover:bg-slate-900/60 transition-all duration-300 shadow-lg"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded bg-slate-950 text-cyan-400">
                        <IconComponent size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-slate-500 rounded bg-slate-950 px-2.5 py-1 border border-slate-900-80">
                        {item.date}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base sm:text-lg font-bold text-slate-100">
                        {item.title}
                      </h4>
                      <p className="text-xs font-mono font-semibold text-cyan-400/90">
                        ID_ISSUER: {item.issuer}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AchievementsGrid;
