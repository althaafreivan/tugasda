import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import confetti from "canvas-confetti";

interface RewardModalProps {
  show: boolean;
  type: "save" | "badge";
  amount?: number;
  badgeName?: string;
  xpGained?: number;
  onClose: () => void;
}

const badges = [
  { id: "first_save", emoji: "🌱", label: "Nabung Perdana!", color: "#00F5A0" },
  { id: "streak_3", emoji: "🔥", label: "Hemat 3 Hari!", color: "#FFD166" },
  { id: "big_save", emoji: "💎", label: "Super Hemat!", color: "#4FC3F7" },
  { id: "goal_near", emoji: "🎯", label: "Hampir Sampai!", color: "#A78BFA" },
];

export function RewardModal({ show, type, amount, badgeName, xpGained = 10, onClose }: RewardModalProps) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (show && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#00F5A0", "#7C3AED", "#FFD166", "#FF4D6D", "#4FC3F7"],
      });
    }
    if (!show) confettiFired.current = false;
  }, [show]);

  const badge = badges.find((b) => b.id === badgeName) || badges[0];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="reward-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(10, 8, 24, 0.88)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="relative w-full max-w-[320px] rounded-[24px] p-7 flex flex-col items-center gap-5 text-center"
            style={{
              background: "linear-gradient(145deg, #1E1B4B 0%, #16123A 100%)",
              border: "1.5px solid rgba(124, 58, 237, 0.45)",
              boxShadow: "0 0 60px rgba(124,58,237,0.35), 0 20px 60px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-[24px] opacity-30 pointer-events-none"
              style={{ boxShadow: "inset 0 0 40px rgba(0,245,160,0.2)" }}
            />

            {/* Animated emoji / pet grow indicator */}
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.1 }}
              className="text-[72px] leading-none select-none"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,245,160,0.6))" }}
            >
              {type === "save" ? "🪙" : badge.emoji}
            </motion.div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <h2
                className="text-[22px]"
                style={{ color: "#F0EEFF", fontWeight: 900, letterSpacing: "-0.3px" }}
              >
                {type === "save" ? "Mantap Jiwa! 🎉" : badge.label}
              </h2>
              <p className="text-[14px]" style={{ color: "#8B7EC8" }}>
                {type === "save"
                  ? `Kamu baru nabung Rp ${amount?.toLocaleString("id-ID")}`
                  : "Badge baru kamu dapet!"}
              </p>
            </div>

            {/* XP pill */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full"
              style={{ background: "rgba(0,245,160,0.15)", border: "1px solid rgba(0,245,160,0.3)" }}
            >
              <span className="text-[13px]" style={{ color: "#00F5A0", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                +{xpGained} XP
              </span>
              <span className="text-[12px]" style={{ color: "#00F5A0", opacity: 0.7 }}>
                Koin naik level!
              </span>
            </motion.div>

            {/* Stars row */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 500, damping: 15 }}
                  className="text-[22px]"
                >
                  ⭐
                </motion.span>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3.5 rounded-[14px] text-[15px] transition-opacity"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #00C4FF 100%)",
                color: "white",
                fontWeight: 800,
                letterSpacing: "0.2px",
                boxShadow: "0 6px 24px rgba(124,58,237,0.45)",
              }}
            >
              Lanjut Hemat! 💪
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
