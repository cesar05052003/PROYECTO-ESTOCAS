import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "./EmptyState";

export default function DataTable({ columns, data, loading, emptyTitle, emptySubtitle, emptyAction, page, pages, onPageChange }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "var(--border)" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "var(--bg-input)" }}>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {c.title || c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t" style={{ borderColor: "#F3F4F6" }}>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} action={emptyAction} />;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "var(--bg-input)" }}>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}
                >
                  {c.title || c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-t transition-colors hover:bg-gray-50 cursor-default"
                style={{ borderColor: "#F3F4F6" }}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {c.render ? c.render(row[c.key], row) : (row[c.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Página {page} de {pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <button
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
