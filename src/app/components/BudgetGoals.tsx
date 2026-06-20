import { motion } from "motion/react";

export interface BudgetTarget {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  color: string;
  deadline: string;
}

interface BudgetGoalsProps {
  targets: BudgetTarget[];
  onAddToGoal: (id: string, amount: number) => void;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#1E1B4B" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-2.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
      />
    </div>
  );
}

const quickAddAmounts = [5000, 10000, 25000];

export function BudgetGoals({ targets, onAddToGoal }: BudgetGoalsProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px]" style={{ color: "#F0EEFF", fontWeight: 800 }}>
          🎯 Target Impian
        </h2>
        <span className="text-[13px]" style={{ color: "#8B7EC8" }}>
          {targets.filter((t) => t.saved >= t.target).length}/{targets.length} selesai
        </span>
      </div>

      {targets.map((target, i) => {
        const pct = (target.saved / target.target) * 100;
        const remaining = target.target - target.saved;
        const isDone = pct >= 100;

        return (
          <motion.div
            key={target.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-[20px] overflow-hidden"
            style={{
              background: "#16123A",
              border: `1.5px solid ${isDone ? target.color + "66" : "rgba(124,58,237,0.22)"}`,
              boxShadow: isDone ? `0 0 24px ${target.color}22` : "none",
            }}
          >
            {/* Card content — Gestalt Common Region bounding the whole target */}
            <div className="p-4 flex flex-col gap-3">
              {/* Header row */}
              <div className="flex items-start gap-3">
                {/* Emoji badge — contained in its own region */}
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 text-[28px]"
                  style={{ background: `${target.color}18`, border: `1.5px solid ${target.color}44` }}
                >
                  {target.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] truncate" style={{ color: "#F0EEFF", fontWeight: 800 }}>
                      {target.name}
                    </h3>
                    {isDone && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: `${target.color}22`, color: target.color, fontWeight: 700 }}
                      >
                        DONE ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[12px]" style={{ color: "#8B7EC8" }}>
                    Deadline: {target.deadline}
                  </p>
                </div>

                {/* Percentage — Gestalt Proximity: right next to target name */}
                <div className="text-right shrink-0">
                  <div
                    className="text-[18px]"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      color: isDone ? target.color : pct > 60 ? "#FFD166" : "#A5B4FC",
                    }}
                  >
                    {pct.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Progress section — Gestalt: saved amount DIRECTLY next to bar */}
              <div className="flex flex-col gap-1.5">
                <ProgressBar value={pct} color={target.color} />
                {/* Saved vs target — Proximity: directly below bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[13px]"
                      style={{ color: target.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
                    >
                      Rp {target.saved.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[12px]" style={{ color: "#4B5563" }}>
                      terkumpul
                    </span>
                  </div>
                  <span
                    className="text-[12px]"
                    style={{ color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    / Rp {target.target.toLocaleString("id-ID")}
                  </span>
                </div>

                {!isDone && (
                  <p className="text-[11px]" style={{ color: "#6B7280" }}>
                    Kurang Rp {remaining.toLocaleString("id-ID")} lagi
                  </p>
                )}
              </div>

              {/* Quick add buttons */}
              {!isDone && (
                <div className="flex gap-2 pt-1">
                  {quickAddAmounts.map((amt) => (
                    <motion.button
                      key={amt}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onAddToGoal(target.id, amt)}
                      className="flex-1 py-2 rounded-[10px] text-[12px]"
                      style={{
                        background: "#1E1B4B",
                        color: "#A5B4FC",
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        border: "1px solid rgba(124,58,237,0.2)",
                      }}
                    >
                      +{amt / 1000}k
                    </motion.button>
                  ))}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onAddToGoal(target.id, 50000)}
                    className="flex-1 py-2 rounded-[10px] text-[12px]"
                    style={{
                      background: `${target.color}15`,
                      color: target.color,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      border: `1px solid ${target.color}44`,
                    }}
                  >
                    +50k 🚀
                  </motion.button>
                </div>
              )}

              {isDone && (
                <div
                  className="flex items-center justify-center gap-2 py-2.5 rounded-[12px]"
                  style={{ background: `${target.color}15`, border: `1px solid ${target.color}33` }}
                >
                  <span className="text-[13px]" style={{ color: target.color, fontWeight: 800 }}>
                    🎉 Target tercapai! Selamat!
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
