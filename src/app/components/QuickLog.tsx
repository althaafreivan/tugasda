import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Category {
  id: string;
  label: string;
  emoji: string;
  defaultAmount: number;
  quickAmounts: number[];
  color: string;
}

const spendCategories: Category[] = [
  { id: "warteg", label: "Warteg", emoji: "🍛", defaultAmount: 12000, quickAmounts: [8000, 12000, 15000, 20000], color: "#FF9A3C" },
  { id: "kopi", label: "Kopi", emoji: "☕", defaultAmount: 8000, quickAmounts: [5000, 8000, 12000, 15000], color: "#C4853A" },
  { id: "fotokopi", label: "Fotokopi", emoji: "📄", defaultAmount: 3000, quickAmounts: [2000, 3000, 5000, 10000], color: "#4FC3F7" },
  { id: "bensin", label: "Bensin", emoji: "⛽", defaultAmount: 20000, quickAmounts: [10000, 20000, 30000, 50000], color: "#FF4D6D" },
  { id: "jajan", label: "Jajan", emoji: "🍡", defaultAmount: 5000, quickAmounts: [3000, 5000, 10000, 15000], color: "#FFD166" },
  { id: "pulsa", label: "Pulsa", emoji: "📱", defaultAmount: 25000, quickAmounts: [10000, 25000, 50000, 100000], color: "#A78BFA" },
];

interface QuickLogProps {
  onSpend: (amount: number, category: string) => void;
  onSave: (amount: number) => void;
  balance: number;
}

export function QuickLog({ onSpend, onSave, balance }: QuickLogProps) {
  const [activeMode, setActiveMode] = useState<"spend" | "save">("spend");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [saveAmounts] = useState([5000, 10000, 20000, 50000]);
  const [selectedSaveAmount, setSelectedSaveAmount] = useState(10000);

  function handleCategoryTap(cat: Category) {
    setSelectedCat(cat);
    setSelectedAmount(cat.defaultAmount);
  }

  function handleConfirmSpend() {
    if (!selectedCat || selectedAmount <= 0) return;
    onSpend(selectedAmount, selectedCat.label);
    setSelectedCat(null);
  }

  function handleConfirmSave() {
    onSave(selectedSaveAmount);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div
        className="flex rounded-[14px] p-1"
        style={{ background: "#1E1B4B" }}
      >
        {(["spend", "save"] as const).map((mode) => (
          <motion.button
            key={mode}
            onClick={() => { setActiveMode(mode); setSelectedCat(null); }}
            className="flex-1 py-2.5 rounded-[11px] text-[14px] transition-colors"
            animate={{
              background: activeMode === mode
                ? mode === "spend" ? "#FF4D6D" : "#00C67E"
                : "rgba(0,0,0,0)",
              color: activeMode === mode ? "#FFFFFF" : "#8B7EC8",
            }}
            transition={{ duration: 0.18 }}
            style={{ fontWeight: 700 }}
          >
            {mode === "spend" ? "⚡ Catat Keluar" : "💰 Nabung"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeMode === "spend" ? (
          <motion.div
            key="spend"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3"
          >
            {/* Category grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {spendCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleCategoryTap(cat)}
                  className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-[14px] transition-all"
                  style={{
                    background: selectedCat?.id === cat.id
                      ? `rgba(${cat.color === "#FF9A3C" ? "255,154,60" : cat.color === "#C4853A" ? "196,133,58" : cat.color === "#4FC3F7" ? "79,195,247" : cat.color === "#FF4D6D" ? "255,77,109" : cat.color === "#FFD166" ? "255,209,102" : "167,139,250"},0.22)`
                      : "#1E1B4B",
                    border: selectedCat?.id === cat.id
                      ? `1.5px solid ${cat.color}`
                      : "1.5px solid rgba(124,58,237,0.18)",
                  }}
                >
                  <span className="text-[26px] leading-none">{cat.emoji}</span>
                  <span className="text-[12px]" style={{ color: "#A5B4FC", fontWeight: 700 }}>{cat.label}</span>
                  <span
                    className="text-[11px]"
                    style={{ color: "#6B7280", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Rp {(cat.defaultAmount / 1000).toFixed(0)}k
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Amount selector – slides in when category is picked */}
            <AnimatePresence>
              {selectedCat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className="p-4 rounded-[14px] flex flex-col gap-3"
                    style={{ background: "#16123A", border: "1.5px solid rgba(124,58,237,0.25)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px]" style={{ color: "#8B7EC8" }}>
                        {selectedCat.emoji} {selectedCat.label} — pilih nominal
                      </span>
                      <button onClick={() => setSelectedCat(null)} style={{ color: "#8B7EC8", fontSize: "18px", lineHeight: 1 }}>×</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedCat.quickAmounts.map((amt) => (
                        <motion.button
                          key={amt}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => setSelectedAmount(amt)}
                          className="py-2 rounded-[10px] text-[12px]"
                          style={{
                            background: selectedAmount === amt ? selectedCat.color : "#1E1B4B",
                            color: selectedAmount === amt ? "#0A0818" : "#A5B4FC",
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            border: `1px solid ${selectedAmount === amt ? selectedCat.color : "transparent"}`,
                          }}
                        >
                          {amt >= 1000 ? `${amt / 1000}k` : amt}
                        </motion.button>
                      ))}
                    </div>
                    {/* Big confirm button */}
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleConfirmSpend}
                      className="w-full py-4 rounded-[14px] text-[16px]"
                      style={{
                        background: "linear-gradient(135deg, #FF4D6D, #FF9A3C)",
                        color: "white",
                        fontWeight: 900,
                        boxShadow: "0 6px 20px rgba(255,77,109,0.4)",
                        minHeight: "56px",
                      }}
                    >
                      Catat Rp {selectedAmount.toLocaleString("id-ID")} 💸
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedCat && (
              <p className="text-[12px] text-center" style={{ color: "#4B5563" }}>
                Tap kategori di atas untuk catat pengeluaran
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="save"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3"
          >
            <p className="text-[13px]" style={{ color: "#8B7EC8" }}>
              Berapa yang mau ditabung hari ini?
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {saveAmounts.map((amt) => (
                <motion.button
                  key={amt}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedSaveAmount(amt)}
                  className="py-3 rounded-[12px] text-[13px]"
                  style={{
                    background: selectedSaveAmount === amt ? "rgba(0,245,160,0.18)" : "#1E1B4B",
                    color: selectedSaveAmount === amt ? "#00F5A0" : "#A5B4FC",
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    border: `1.5px solid ${selectedSaveAmount === amt ? "#00F5A0" : "rgba(124,58,237,0.2)"}`,
                  }}
                >
                  {amt >= 1000 ? `${amt / 1000}k` : amt}
                </motion.button>
              ))}
            </div>

            <div
              className="flex items-center gap-3 px-4 py-3 rounded-[12px]"
              style={{ background: "#1E1B4B" }}
            >
              <span className="text-[13px]" style={{ color: "#8B7EC8" }}>Saldo tersedia:</span>
              <span
                className="text-[14px]"
                style={{ color: "#F0EEFF", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                Rp {balance.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Big save CTA */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleConfirmSave}
              className="w-full py-4 rounded-[14px] text-[16px]"
              style={{
                background: "linear-gradient(135deg, #00C67E, #00F5A0)",
                color: "#0A0818",
                fontWeight: 900,
                boxShadow: "0 6px 20px rgba(0,245,160,0.35)",
                minHeight: "56px",
              }}
            >
              Nabung Rp {selectedSaveAmount.toLocaleString("id-ID")} 💚
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
