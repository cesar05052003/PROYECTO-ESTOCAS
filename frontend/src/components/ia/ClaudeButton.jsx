import { Sparkles } from "lucide-react";

export default function ClaudeButton({ onClick, loading, label = "Generar con IA", className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60 ${className}`}
      style={{ backgroundColor: "var(--accent)" }}
      onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
          Generando...
        </>
      ) : (
        <>
          <Sparkles size={15} />
          {label}
        </>
      )}
    </button>
  );
}
