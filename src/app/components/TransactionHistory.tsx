import { motion } from "motion/react";

export interface Transaction {
  id: string;
  type: "spend" | "save";
  category: string;
  amount: number;
  timestamp: Date;
  emoji: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Barusan";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <span className="text-[48px]">📭</span>
        <p className="text-[14px]" style={{ color: "#4B5563" }}>
          Belum ada transaksi nih
        </p>
        <p className="text-[13px]" style={{ color: "#374151" }}>
          Catat pengeluaran atau tabungan kamu!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-6">
      <h2 className="text-[18px] mb-2" style={{ color: "#F0EEFF", fontWeight: 800 }}>
        📋 Riwayat
      </h2>
      {transactions.map((tx, i) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-3 px-4 py-3 rounded-[14px]"
          style={{
            background: "#16123A",
            border: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[20px] shrink-0"
            style={{
              background: tx.type === "save" ? "rgba(0,245,160,0.12)" : "rgba(255,77,109,0.12)",
            }}
          >
            {tx.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] truncate" style={{ color: "#F0EEFF", fontWeight: 700 }}>
              {tx.category}
            </p>
            <p className="text-[12px]" style={{ color: "#8B7EC8" }}>
              {timeAgo(tx.timestamp)}
            </p>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <span
              className="text-[14px]"
              style={{
                color: tx.type === "save" ? "#00F5A0" : "#FF4D6D",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
              }}
            >
              {tx.type === "save" ? "+" : "-"}Rp {tx.amount.toLocaleString("id-ID")}
            </span>
            <div
              className="text-[11px] text-right"
              style={{ color: tx.type === "save" ? "#00C67E" : "#FF6B87" }}
            >
              {tx.type === "save" ? "ditabung" : "keluar"}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
