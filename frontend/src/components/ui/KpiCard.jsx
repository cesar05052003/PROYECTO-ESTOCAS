import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KpiCard({ icon: Icon, value, label, trend, trendLabel, accentColor = "var(--accent)", loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 pulse" style={{ boxShadow: "var(--shadow)", borderLeft: `3px solid ${accentColor}` }}>
        <div className="h-8 w-8 rounded-lg mb-4 bg-gray-200" />
        <div className="h-7 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl p-5 transition-shadow hover:shadow-md"
      style={{ boxShadow: "var(--shadow)", borderLeft: `3px solid ${accentColor}` }}
    >
      {Icon && (
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg mb-4"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
      )}
      <div className="font-mono text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)", fontFamily: "DM Mono, monospace" }}>
        {value ?? "—"}
      </div>
      <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
        {label}
      </div>
      {trendLabel && (
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: trend > 0 ? "var(--danger)" : trend < 0 ? "var(--success)" : "var(--text-muted)" }}
        >
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}
