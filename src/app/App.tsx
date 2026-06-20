import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PetDisplay } from "./components/PetDisplay";
import { QuickLog } from "./components/QuickLog";
import { BudgetGoals, BudgetTarget } from "./components/BudgetGoals";
import { TransactionHistory, Transaction } from "./components/TransactionHistory";
import { RewardModal } from "./components/RewardModal";
import { StatsPanel } from "./components/StatsPanel";
import { ProfilePanel } from "./components/ProfilePanel";

type Tab = "home" | "goals" | "history" | "stats" | "profile";
type PetMood = "happy" | "neutral" | "sad";
type PetLevel = 1 | 2 | 3 | 4;

const categoryEmoji: Record<string, string> = {
  Warteg: "🍛", Kopi: "☕", Fotokopi: "📄",
  Bensin: "⛽", Jajan: "🍡", Pulsa: "📱", Nabung: "💰",
};

const initialTargets: BudgetTarget[] = [
  { id: "konser", name: "Tiket Konser", emoji: "🎵", target: 350000, saved: 125000, color: "#A78BFA", deadline: "Sep 2025" },
  { id: "sepatu", name: "Sepatu Baru", emoji: "👟", target: 550000, saved: 230000, color: "#FFD166", deadline: "Okt 2025" },
  { id: "buku", name: "Buku Semester", emoji: "📚", target: 180000, saved: 90000, color: "#4FC3F7", deadline: "Agu 2025" },
  { id: "makan", name: "Makan Enak", emoji: "🍜", target: 100000, saved: 100000, color: "#00F5A0", deadline: "Jul 2025" },
];

const initialTransactions: Transaction[] = [
  { id: "t1", type: "save", category: "Nabung", amount: 20000, timestamp: new Date(Date.now() - 2 * 60000), emoji: "💰" },
  { id: "t2", type: "spend", category: "Warteg", amount: 12000, timestamp: new Date(Date.now() - 25 * 60000), emoji: "🍛" },
  { id: "t3", type: "spend", category: "Kopi", amount: 8000, timestamp: new Date(Date.now() - 2 * 3600000), emoji: "☕" },
  { id: "t4", type: "save", category: "Nabung", amount: 50000, timestamp: new Date(Date.now() - 5 * 3600000), emoji: "💰" },
  { id: "t5", type: "spend", category: "Fotokopi", amount: 3000, timestamp: new Date(Date.now() - 24 * 3600000), emoji: "📄" },
];

function getPetMood(savings: number, weekSpend: number): PetMood {
  if (savings >= 150000 || savings > weekSpend * 0.4) return "happy";
  if (savings >= 50000) return "neutral";
  return "sad";
}

function getPetLevel(savings: number): PetLevel {
  if (savings >= 200000) return 4;
  if (savings >= 100000) return 3;
  if (savings >= 40000) return 2;
  return 1;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [balance, setBalance] = useState(234500);
  const [totalSaved, setTotalSaved] = useState(125000);
  const [xp, setXp] = useState(38);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [targets, setTargets] = useState<BudgetTarget[]>(initialTargets);

  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const weekSpend = transactions
    .filter((t) => t.type === "spend" && Date.now() - t.timestamp.getTime() < 7 * 86400000)
    .reduce((s, t) => s + t.amount, 0);

  const petMood = getPetMood(totalSaved, weekSpend);
  const petLevel = getPetLevel(totalSaved);

  const handleSpend = useCallback((amount: number, category: string) => {
    setBalance((b) => Math.max(0, b - amount));
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "spend",
        category,
        amount,
        timestamp: new Date(),
        emoji: categoryEmoji[category] || "💸",
      },
      ...prev,
    ]);
  }, []);

  const handleSave = useCallback((amount: number) => {
    if (amount > balance) return;
    setBalance((b) => b - amount);
    setTotalSaved((s) => s + amount);
    setXp((x) => x + 10);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "save",
        category: "Nabung",
        amount,
        timestamp: new Date(),
        emoji: "💰",
      },
      ...prev,
    ]);
    setRewardAmount(amount);
    setShowReward(true);
  }, [balance]);

  const handleAddToGoal = useCallback((id: string, amount: number) => {
    if (amount > balance) return;
    setBalance((b) => b - amount);
    setTotalSaved((s) => s + amount);
    setXp((x) => x + 8);
    setTargets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, saved: Math.min(t.saved + amount, t.target) } : t
      )
    );
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "save",
        category: `Goal: ${targets.find((t) => t.id === id)?.name || id}`,
        amount,
        timestamp: new Date(),
        emoji: targets.find((t) => t.id === id)?.emoji || "🎯",
      },
      ...prev,
    ]);
    setRewardAmount(amount);
    setShowReward(true);
  }, [balance, targets]);

  const tabs: { id: Tab; emoji: string; label: string }[] = [
    { id: "home",    emoji: "🏠", label: "Beranda" },
    { id: "goals",   emoji: "🎯", label: "Target"  },
    { id: "stats",   emoji: "📊", label: "Statistik" },
    { id: "history", emoji: "📋", label: "Riwayat" },
    { id: "profile", emoji: "👤", label: "Profil"  },
  ];

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "#050412" }}
    >
      {/* Mobile shell */}
      <div
        className="relative flex flex-col w-full h-full overflow-hidden"
        style={{ maxWidth: "430px", background: "#0A0818" }}
      >
        {/* Status bar area */}
        <div
          className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0"
          style={{ background: "#0A0818" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[20px] leading-none"
              style={{ filter: "drop-shadow(0 0 8px #7C3AED)" }}
            >
              🪙
            </span>
            <span
              className="text-[18px]"
              style={{ color: "#F0EEFF", fontWeight: 900, letterSpacing: "-0.5px" }}
            >
              Flnamin
            </span>
          </div>
          {/* Balance pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <span className="text-[11px]" style={{ color: "#8B7EC8" }}>Saldo</span>
            <span
              className="text-[13px]"
              style={{ color: "#F0EEFF", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
            >
              Rp {balance.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5 px-4 pt-2 pb-28"
              >
                {/* Hero balance card */}
                <div
                  className="rounded-[22px] p-5 flex flex-col gap-2"
                  style={{
                    background: "linear-gradient(135deg, #1E1B4B 0%, #16123A 100%)",
                    border: "1.5px solid rgba(124,58,237,0.3)",
                    boxShadow: "0 8px 32px rgba(124,58,237,0.15)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px]" style={{ color: "#8B7EC8" }}>Total Tabungan</p>
                      <p
                        className="text-[28px] mt-0.5"
                        style={{
                          color: "#00F5A0",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          letterSpacing: "-1px",
                        }}
                      >
                        Rp {totalSaved.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-full text-[12px]"
                      style={{ background: "rgba(0,245,160,0.12)", color: "#00F5A0", fontWeight: 700 }}
                    >
                      +Rp {transactions.filter(t => t.type === "save").slice(0,3).reduce((s,t) => s + t.amount, 0).toLocaleString("id-ID")} minggu ini
                    </div>
                  </div>

                  {/* Spending vs saving mini stats */}
                  <div className="flex gap-3 mt-1">
                    <div
                      className="flex-1 flex items-center gap-2 px-3 py-2 rounded-[10px]"
                      style={{ background: "rgba(255,77,109,0.1)" }}
                    >
                      <span className="text-[14px]">📤</span>
                      <div>
                        <p className="text-[10px]" style={{ color: "#8B7EC8" }}>Keluar minggu ini</p>
                        <p className="text-[12px]" style={{ color: "#FF4D6D", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                          Rp {weekSpend.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex-1 flex items-center gap-2 px-3 py-2 rounded-[10px]"
                      style={{ background: "rgba(0,245,160,0.08)" }}
                    >
                      <span className="text-[14px]">📈</span>
                      <div>
                        <p className="text-[10px]" style={{ color: "#8B7EC8" }}>XP Total</p>
                        <p className="text-[12px]" style={{ color: "#00F5A0", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                          {xp} XP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet section */}
                <div
                  className="rounded-[22px] py-5 px-4 flex flex-col items-center"
                  style={{
                    background: "linear-gradient(160deg, #1A1040 0%, #16123A 100%)",
                    border: "1.5px solid rgba(124,58,237,0.2)",
                  }}
                >
                  <PetDisplay
                    mood={petMood}
                    level={petLevel}
                    name="Koin"
                    xp={xp}
                  />
                </div>

                {/* Quick Log */}
                <div
                  className="rounded-[22px] p-4"
                  style={{
                    background: "#16123A",
                    border: "1.5px solid rgba(124,58,237,0.2)",
                  }}
                >
                  <h3 className="text-[15px] mb-3" style={{ color: "#F0EEFF", fontWeight: 800 }}>
                    ⚡ Catat Sekarang
                  </h3>
                  <QuickLog onSpend={handleSpend} onSave={handleSave} balance={balance} />
                </div>
              </motion.div>
            )}

            {tab === "goals" && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="px-4 pt-4 pb-28"
              >
                <BudgetGoals targets={targets} onAddToGoal={handleAddToGoal} />
              </motion.div>
            )}

            {tab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
                className="px-4 pt-4 pb-28"
              >
                <TransactionHistory transactions={transactions} />
              </motion.div>
            )}

            {tab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="px-4 pt-4 pb-28"
              >
                <StatsPanel
                  transactions={transactions}
                  totalSaved={totalSaved}
                  balance={balance}
                />
              </motion.div>
            )}

            {tab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="px-4 pt-4 pb-28"
              >
                <ProfilePanel
                  transactions={transactions}
                  totalSaved={totalSaved}
                  xp={xp}
                  petLevel={petLevel}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom navigation — Fitts's Law: large, thumb-reachable */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center px-4 pt-2 pb-4 gap-2"
          style={{
            background: "linear-gradient(to top, #0A0818 80%, transparent)",
            backdropFilter: "blur(12px)",
          }}
        >
          {tabs.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-[12px]"
              style={{
                background: tab === t.id ? "rgba(124,58,237,0.2)" : "rgba(0,0,0,0)",
                border: tab === t.id ? "1.5px solid rgba(124,58,237,0.4)" : "1.5px solid rgba(0,0,0,0)",
                minHeight: "52px",
              }}
            >
              <span className="text-[19px] leading-none">{t.emoji}</span>
              <span
                className="text-[9px]"
                style={{
                  color: tab === t.id ? "#C4B5FD" : "#4B5563",
                  fontWeight: tab === t.id ? 700 : 600,
                }}
              >
                {t.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reward Modal */}
      <RewardModal
        show={showReward}
        type="save"
        amount={rewardAmount}
        xpGained={10}
        onClose={() => setShowReward(false)}
      />
    </div>
  );
}
