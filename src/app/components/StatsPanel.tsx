import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
// ResponsiveContainer is used for BarChart only; PieChart uses fixed dimensions to avoid key conflicts
import { motion } from "motion/react";
import { Transaction } from "./TransactionHistory";

interface StatsPanelProps {
  transactions: Transaction[];
  totalSaved: number;
  balance: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Warteg:    "#FF9A3C",
  Kopi:      "#C4853A",
  Fotokopi:  "#4FC3F7",
  Bensin:    "#FF4D6D",
  Jajan:     "#FFD166",
  Pulsa:     "#A78BFA",
  Nabung:    "#00F5A0",
};

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function buildPieData(transactions: Transaction[]) {
  const spend = transactions.filter((t) => t.type === "spend");
  const map: Record<string, number> = {};
  for (const t of spend) {
    map[t.category] = (map[t.category] || 0) + t.amount;
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildBarData(transactions: Transaction[]) {
  const now = new Date();
  return DAYS.map((day, i) => {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - (6 - i));
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const spend = transactions
      .filter((t) => t.type === "spend" && t.timestamp >= dayStart && t.timestamp <= dayEnd)
      .reduce((s, t) => s + t.amount, 0);
    const save = transactions
      .filter((t) => t.type === "save" && t.timestamp >= dayStart && t.timestamp <= dayEnd)
      .reduce((s, t) => s + t.amount, 0);

    return { day, spend, save };
  });
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 text-[12px]"
      style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.4)", color: "#F0EEFF", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {payload.map((p, i) => (
        <div key={i}>
          {p.name}: Rp {p.value.toLocaleString("id-ID")}
        </div>
      ))}
    </div>
  );
}

export function StatsPanel({ transactions, totalSaved, balance }: StatsPanelProps) {
  const pieData  = buildPieData(transactions);
  const barData  = buildBarData(transactions);
  const totalSpend = transactions.filter((t) => t.type === "spend").reduce((s, t) => s + t.amount, 0);
  const savingRate = totalSaved + totalSpend > 0
    ? Math.round((totalSaved / (totalSaved + totalSpend)) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <h2 className="text-[18px]" style={{ color: "#F0EEFF", fontWeight: 800 }}>
        📊 Statistik
      </h2>

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Saving rate", value: `${savingRate}%`, sub: "dari total uang", accent: "#00F5A0" },
          { label: "Total keluar", value: `${(totalSpend / 1000).toFixed(0)}k`, sub: "rupiah", accent: "#FF4D6D" },
          { label: "Saldo kini",  value: `${(balance / 1000).toFixed(0)}k`, sub: "rupiah", accent: "#A78BFA" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex flex-col gap-1 p-3 rounded-[14px]"
            style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <span className="text-[11px]" style={{ color: "#8B7EC8" }}>{s.label}</span>
            <span
              className="text-[20px]"
              style={{ color: s.accent, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
            >
              {s.value}
            </span>
            <span className="text-[10px]" style={{ color: "#4B5563" }}>{s.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* 7-day bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-[16px] p-4"
        style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.2)" }}
      >
        <p className="text-[13px] mb-3" style={{ color: "#A5B4FC", fontWeight: 700 }}>
          7 Hari Terakhir
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={barData} barCategoryGap="28%" barGap={2}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#8B7EC8", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
            <Bar dataKey="spend" name="Keluar" fill="#FF4D6D" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="save"  name="Nabung" fill="#00F5A0" radius={[3, 3, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#FF4D6D" }} />
            <span className="text-[11px]" style={{ color: "#8B7EC8" }}>Keluar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#00F5A0" }} />
            <span className="text-[11px]" style={{ color: "#8B7EC8" }}>Nabung</span>
          </div>
        </div>
      </motion.div>

      {/* Pie chart — spending breakdown */}
      {pieData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="rounded-[16px] p-4"
          style={{ background: "#16123A", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <p className="text-[13px] mb-3" style={{ color: "#A5B4FC", fontWeight: 700 }}>
            Pengeluaran per Kategori
          </p>
          <div className="flex items-center gap-4">
            <PieChart width={130} height={130}>
              <Pie
                data={pieData}
                cx={65}
                cy={65}
                innerRadius={38}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name] || `hsl(${index * 60}, 70%, 60%)`}
                  />
                ))}
              </Pie>
            </PieChart>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {pieData.slice(0, 5).map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: CATEGORY_COLORS[entry.name] || "#888" }}
                  />
                  <span className="text-[12px] truncate" style={{ color: "#A5B4FC" }}>{entry.name}</span>
                  <span
                    className="text-[11px] ml-auto shrink-0"
                    style={{ color: "#8B7EC8", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {((entry.value / totalSpend) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bocor alus indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="rounded-[16px] p-4 flex flex-col gap-2"
        style={{
          background: "#16123A",
          border: savingRate < 20
            ? "1.5px solid rgba(255,77,109,0.5)"
            : "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[13px]" style={{ color: "#A5B4FC", fontWeight: 700 }}>
            💧 Bocor Alus Index
          </p>
          <span
            className="text-[12px] px-2 py-0.5 rounded-full"
            style={{
              background: savingRate >= 30 ? "rgba(0,245,160,0.15)" : savingRate >= 15 ? "rgba(255,209,102,0.15)" : "rgba(255,77,109,0.15)",
              color: savingRate >= 30 ? "#00F5A0" : savingRate >= 15 ? "#FFD166" : "#FF4D6D",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
            }}
          >
            {savingRate >= 30 ? "AMAN ✓" : savingRate >= 15 ? "WASPADA" : "BOCOR!"}
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#1E1B4B" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${savingRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-2.5 rounded-full"
            style={{
              background: savingRate >= 30
                ? "linear-gradient(90deg, #00C67E, #00F5A0)"
                : savingRate >= 15
                ? "linear-gradient(90deg, #FFB800, #FFD166)"
                : "linear-gradient(90deg, #CC0033, #FF4D6D)",
            }}
          />
        </div>
        <p className="text-[12px]" style={{ color: "#6B7280" }}>
          {savingRate >= 30
            ? "Mantap! Kamu berhasil menabung dengan baik."
            : savingRate >= 15
            ? "Lumayan, tapi bisa lebih hemat lagi nih!"
            : "Uang kamu bocor alus banget. Yuk nabung lebih!"}
        </p>
      </motion.div>
    </div>
  );
}
