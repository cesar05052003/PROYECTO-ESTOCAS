import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Sin registros", subtitle, description, action, actionLabel, onAction }) {
  const desc = description || subtitle || "No hay datos disponibles para mostrar.";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-white rounded-xl border" style={{ borderColor: "var(--border)" }}>
      <Icon size={48} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} className="mb-4" />
      <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)", maxWidth: 320 }}>{desc}</p>
      {action}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">{actionLabel}</button>
      )}
    </div>
  );
}
