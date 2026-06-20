import { motion } from "motion/react";
import { Transaction } from "./TransactionHistory";

interface ProfilePanelProps {
  transactions: Transaction[];
  totalSaved: number;
  xp: number;
  petLevel: number;
}

interface Badge {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  requirement: (tx: Transaction[], saved: number) => boolean;
  color: string;
}

const ALL_BADGES: Badge[] = [
  {
    id: "first_save",
    emoji: "🌱",
    label: "Nabung Perdana",
    desc: "Lakukan tabungan pertama kamu",
    requirement: (tx) => tx.some((t) => t.type === "save"),
    color: "#00F5A0",
  },
  {
    id: "warteg_warrior",
    emoji: "🍛",
    label: "Warteg Warrior",
    desc: "Catat 3x makan di warteg",
    requirement: (tx) => tx.filter((t) => t.category === "Warteg").length >= 3,
    color: "#FF9A3C",
  },
  {
    id: "kopi_addict",
    emoji: "☕",
    label: "Kopi Addict",
    desc: "Catat 5x beli kopi",
    requirement: (tx) => tx.filter((t) => t.category === "Kopi").length >= 5,
    color: "#C4853A",
  },
  {
    id: "big_saver",
    emoji: "💎",
    label: "Super Hemat",
    desc: "Tabung total lebih dari Rp 100.000",
    requirement: (_, saved) => saved >= 100000,
    color: "#4FC3F7",
  },
  {
    id: "historian",
    emoji: "📋",
    label: "Rajin Catat",
    desc: "Catat lebih dari 10 transaksi",
    requirement: (tx) => tx.length >= 10,
    color: "#A78BFA",
  },
  {
    id: "no_kopi",
    emoji: "🚫☕",
    label: "Anti Kopi",
    desc: "Nabung lebih dari pengeluaran kopi",
    requirement: (tx, saved) => {
      const kopiSpend = tx.filter((t) => t.category === "Kopi").reduce((s, t) => s + t.amount, 0);
      return saved > kopiSpend && kopiSpend > 0;
    },
    color: "#FFD166",
  },
  {
    id: "level_3",
    emoji: "⭐",
    label: "Rising Star",
    desc: "Capai level 3 atau lebih",
    requirement: (_, saved) => saved >= 100000,
    color: "#FFD166",
  },
  {
    id: "photocopy_pro",
    emoji: "📄",
    label: "Photocopy Pro",
    desc: "Catat 5x fotokopi",
    requirement: (tx) => tx.filter((t) => t.category === "Fotokopi").length >= 5,
    color: "#4FC3F7",
  },
];

const XP_TITLES = [
  { min: 0,   label: "Mahasiswa Baru",    emoji: "🎒" },
  { min: 30,  label: "Anak Kost Hemat",   emoji: "🏠" },
  { min: 80,  label: "Penabung Handal",   emoji: "💪" },
  { min: 150, label: "Ahli Finansial",    emoji: "🏆" },
  { min: 250, label: "Sultan Kampus",     emoji: "👑" },
];

function getTitle(xp: number) {
  return [...XP_TITLES].reverse().find((t) => xp >= t.min) || XP_TITLES[0];
}

export function ProfilePanel({ transactions, totalSaved, xp, petLevel }: ProfilePanelProps) {
  const earnedBadges = ALL_BADGES.filter((b) => b.requirement(transactions, totalSaved));
  const lockedBadges = ALL_BADGES.filter((b) => !b.requirement(transactions, totalSaved));
  const title = getTitle(xp);
  const nextTitle = XP_TITLES.find((t) => t.min > xp);
  const xpToNext = nextTitle ? nextTitle.min - xp : 0;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <h2 className="text-[18px]" style={{ color: "#F0EEFF", fontWeight: 800 }}>
        👤 Profil
      </h2>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[20px] p-5 flex flex-col gap-4"
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #16123A 100%)",
          border: "1.5px solid rgba(124,58,237,0.35)",
        }}
      >
        {/* Avatar + title */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-[16px] flex items-center justify-center text-[36px]"
            style={{ background: "rgba(124,58,237,0.2)", border: "2px solid rgba(124,58,237,0.4)" }}
          >
            {title.emoji}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[16px]" style={{ color: "#F0EEFF", fontWeight: 800 }}>
              {title.label}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-[12px] px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,245,160,0.15)", color: "#00F5A0", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {xp} XP
              </span>
              <span
                className="text-[12px] px-2 py-0.5 rounded-full"
                style={{ background: "rgba(124,58,237,0.2)", color: "#A5B4FC", fontFamily: "'JetBrains Mono', monospace" }}
              >
                LV {petLevel}
              </span>
            </div>
          </div>
        </div>

        {/* XP progress to next rank */}
        {nextTitle && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "#8B7EC8" }}>Menuju {nextTitle.emoji} {nextTitle.label}</span>
              <span className="text-[11px]" style={{ color: "#8B7EC8", fontFamily: "'JetBrains Mono', monospace" }}>
                {xpToNext} XP lagi
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#0A0818" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((xp - (XP_TITLES.find(t => t.min <= xp)?.min || 0)) / (nextTitle.min - (XP_TITLES.find(t => t.min <= xp)?.min || 0))) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-2 rounded-full"
                style={{ background: "linear-gradient(90deg, #7C3AED, #00F5A0)" }}
              />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: "rgba(124,58,237,0.2)" }}>
          {[
            { label: "Transaksi", value: transactions.length },
            { label: "Badge", value: earnedBadges.length },
            { label: "Tabungan", value: `${(totalSaved / 1000).toFixed(0)}k` },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span
                className="text-[18px]"
                style={{ color: "#F0EEFF", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {s.value}
              </span>
              <span className="text-[11px]" style={{ color: "#8B7EC8" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Earned badges */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-[14px]" style={{ color: "#A5B4FC", fontWeight: 700 }}>
            Badge Terkumpul
          </p>
          <span
            className="text-[12px] px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,245,160,0.15)", color: "#00F5A0", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
          >
            {earnedBadges.length}/{ALL_BADGES.length}
          </span>
        </div>

        {earnedBadges.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-8 rounded-[14px]"
            style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.15)" }}
          >
            <span className="text-[32px]">🎯</span>
            <p className="text-[13px]" style={{ color: "#6B7280" }}>
              Belum ada badge. Mulai nabung!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {earnedBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 400, damping: 22 }}
                className="flex items-center gap-3 p-3 rounded-[14px]"
                style={{
                  background: "#16123A",
                  border: `1.5px solid ${badge.color}44`,
                  boxShadow: `0 0 16px ${badge.color}18`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[22px] shrink-0"
                  style={{ background: `${badge.color}18` }}
                >
                  {badge.emoji}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[12px] truncate" style={{ color: "#F0EEFF", fontWeight: 700 }}>
                    {badge.label}
                  </span>
                  <span className="text-[10px]" style={{ color: "#8B7EC8" }}>
                    {badge.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Locked badges */}
      {lockedBadges.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px]" style={{ color: "#4B5563", fontWeight: 700 }}>
            Belum Terbuka 🔒
          </p>
          <div className="grid grid-cols-2 gap-2">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-3 rounded-[14px] opacity-45"
                style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.1)" }}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[22px] shrink-0 grayscale"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {badge.emoji}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[12px] truncate" style={{ color: "#6B7280", fontWeight: 700 }}>
                    {badge.label}
                  </span>
                  <span className="text-[10px]" style={{ color: "#4B5563" }}>
                    {badge.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
