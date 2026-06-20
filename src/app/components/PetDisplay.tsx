import { motion } from "motion/react";

type PetMood = "happy" | "neutral" | "sad";
type PetLevel = 1 | 2 | 3 | 4;

interface PetDisplayProps {
  mood: PetMood;
  level: PetLevel;
  name: string;
  xp: number;
}

function HappyFace() {
  return (
    <>
      {/* Eyes */}
      <ellipse cx="72" cy="88" rx="10" ry="11" fill="#1A0E3A" />
      <ellipse cx="108" cy="88" rx="10" ry="11" fill="#1A0E3A" />
      {/* Eye shine */}
      <circle cx="76" cy="84" r="3.5" fill="white" />
      <circle cx="112" cy="84" r="3.5" fill="white" />
      {/* Happy squint / smile eyes */}
      <path d="M63 82 Q72 76 81 82" fill="none" stroke="#1A0E3A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M99 82 Q108 76 117 82" fill="none" stroke="#1A0E3A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Big smile */}
      <path d="M68 108 Q90 126 112 108" fill="none" stroke="#1A0E3A" strokeWidth="4" strokeLinecap="round" />
      {/* Teeth */}
      <path d="M75 110 Q90 122 105 110" fill="white" />
      {/* Blush */}
      <ellipse cx="54" cy="104" rx="10" ry="6" fill="#FF6B9D" opacity="0.55" />
      <ellipse cx="126" cy="104" rx="10" ry="6" fill="#FF6B9D" opacity="0.55" />
      {/* Sparkles */}
      <text x="28" y="62" fontSize="16" textAnchor="middle" fill="#FFD166">✦</text>
      <text x="150" y="58" fontSize="14" textAnchor="middle" fill="#00F5A0">✦</text>
      <text x="148" y="80" fontSize="10" textAnchor="middle" fill="#FFD166">✦</text>
    </>
  );
}

function NeutralFace() {
  return (
    <>
      <ellipse cx="72" cy="90" rx="10" ry="11" fill="#1A0E3A" />
      <ellipse cx="108" cy="90" rx="10" ry="11" fill="#1A0E3A" />
      <circle cx="76" cy="86" r="3.5" fill="white" />
      <circle cx="112" cy="86" r="3.5" fill="white" />
      {/* Neutral mouth */}
      <path d="M74 112 Q90 118 106 112" fill="none" stroke="#1A0E3A" strokeWidth="3.5" strokeLinecap="round" />
      {/* Light blush */}
      <ellipse cx="54" cy="106" rx="9" ry="5" fill="#FF6B9D" opacity="0.3" />
      <ellipse cx="126" cy="106" rx="9" ry="5" fill="#FF6B9D" opacity="0.3" />
    </>
  );
}

function SadFace() {
  return (
    <>
      <ellipse cx="72" cy="92" rx="10" ry="11" fill="#1A0E3A" />
      <ellipse cx="108" cy="92" rx="10" ry="11" fill="#1A0E3A" />
      <circle cx="76" cy="88" r="3.5" fill="white" />
      <circle cx="112" cy="88" r="3.5" fill="white" />
      {/* Sad brows */}
      <path d="M63 80 Q72 86 81 80" fill="none" stroke="#1A0E3A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M99 80 Q108 86 117 80" fill="none" stroke="#1A0E3A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sad mouth */}
      <path d="M74 118 Q90 108 106 118" fill="none" stroke="#1A0E3A" strokeWidth="3.5" strokeLinecap="round" />
      {/* Tears */}
      <ellipse cx="72" cy="106" rx="4" ry="6" fill="#4FC3F7" opacity="0.7" />
      <ellipse cx="108" cy="106" rx="4" ry="6" fill="#4FC3F7" opacity="0.7" />
    </>
  );
}

const petColors: Record<PetLevel, { body: string[]; belly: string }> = {
  1: { body: ["#6D28D9", "#4C1D95"], belly: "#8B5CF6" },
  2: { body: ["#7C3AED", "#5B21B6"], belly: "#A78BFA" },
  3: { body: ["#8B5CF6", "#6D28D9"], belly: "#C4B5FD" },
  4: { body: ["#00C4FF", "#7C3AED"], belly: "#E0D7FF" },
};

const petSize: Record<PetLevel, number> = { 1: 0.75, 2: 0.88, 3: 1.0, 4: 1.12 };

export function PetDisplay({ mood, level, name, xp }: PetDisplayProps) {
  const colors = petColors[level];
  const scale = petSize[level];

  const floatAnim = {
    y: mood === "happy" ? [0, -12, 0] : mood === "sad" ? [0, -3, 0] : [0, -7, 0],
    transition: {
      duration: mood === "happy" ? 1.8 : 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* XP bar */}
      <div className="flex items-center gap-2 w-full max-w-[200px]">
        <span
          className="text-[11px] px-2 py-0.5 rounded-full"
          style={{ background: "#7C3AED", color: "white", fontFamily: "'JetBrains Mono', monospace" }}
        >
          LV {level}
        </span>
        <div className="flex-1 h-2 rounded-full" style={{ background: "#1E1B4B" }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(xp % 100, 100)}%`,
              background: "linear-gradient(90deg, #7C3AED, #00F5A0)",
            }}
          />
        </div>
        <span
          className="text-[11px]"
          style={{ color: "#8B7EC8", fontFamily: "'JetBrains Mono', monospace" }}
        >
          {xp % 100}/100
        </span>
      </div>

      {/* Pet SVG */}
      <motion.div animate={floatAnim} style={{ display: "inline-block" }}>
        <svg
          width={180 * scale}
          height={160 * scale}
          viewBox="0 0 180 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`bodyGrad-${level}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={colors.body[0]} />
              <stop offset="100%" stopColor={colors.body[1]} />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Shadow */}
          <ellipse cx="90" cy="154" rx="40" ry="6" fill="black" opacity="0.25" />

          {/* Left arm */}
          {mood === "happy" ? (
            <ellipse cx="30" cy="90" rx="14" ry="10" fill={`url(#bodyGrad-${level})`} transform="rotate(-40 30 90)" />
          ) : mood === "sad" ? (
            <ellipse cx="35" cy="112" rx="14" ry="10" fill={`url(#bodyGrad-${level})`} transform="rotate(20 35 112)" />
          ) : (
            <ellipse cx="32" cy="100" rx="14" ry="10" fill={`url(#bodyGrad-${level})`} transform="rotate(-10 32 100)" />
          )}

          {/* Right arm */}
          {mood === "happy" ? (
            <ellipse cx="150" cy="90" rx="14" ry="10" fill={`url(#bodyGrad-${level})`} transform="rotate(40 150 90)" />
          ) : mood === "sad" ? (
            <ellipse cx="145" cy="112" rx="14" ry="10" fill={`url(#bodyGrad-${level})`} transform="rotate(-20 145 112)" />
          ) : (
            <ellipse cx="148" cy="100" rx="14" ry="10" fill={`url(#bodyGrad-${level})`} transform="rotate(10 148 100)" />
          )}

          {/* Body */}
          <ellipse cx="90" cy="95" rx="60" ry="62" fill={`url(#bodyGrad-${level})`} filter="url(#glow)" />

          {/* Belly */}
          <ellipse cx="90" cy="102" rx="36" ry="34" fill={colors.belly} opacity="0.35" />

          {/* Face */}
          {mood === "happy" ? <HappyFace /> : mood === "sad" ? <SadFace /> : <NeutralFace />}

          {/* Left foot */}
          <ellipse cx="68" cy="150" rx="18" ry="9" fill={colors.body[1]} />
          {/* Right foot */}
          <ellipse cx="112" cy="150" rx="18" ry="9" fill={colors.body[1]} />
        </svg>
      </motion.div>

      {/* Pet name + mood label */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[15px] font-bold" style={{ color: "#F0EEFF" }}>
          {name}
        </span>
        <span
          className="text-[12px] px-3 py-0.5 rounded-full"
          style={{
            background: mood === "happy" ? "rgba(0,245,160,0.18)" : mood === "sad" ? "rgba(255,77,109,0.18)" : "rgba(165,180,252,0.15)",
            color: mood === "happy" ? "#00F5A0" : mood === "sad" ? "#FF4D6D" : "#A5B4FC",
          }}
        >
          {mood === "happy" ? "✦ Senang banget!" : mood === "sad" ? "Tolong nabung dong..." : "Lumayan nih~"}
        </span>
      </div>
    </div>
  );
}
