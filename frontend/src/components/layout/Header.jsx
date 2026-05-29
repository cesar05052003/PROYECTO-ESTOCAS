import { Menu, Bell } from "lucide-react";

export default function Header({ title, subtitle, actions, onMenuToggle, alertCount = 0 }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b bg-white"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div>
          <h1 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{title}</h1>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell size={18} style={{ color: "var(--text-secondary)" }} />
          {alertCount > 0 && (
            <span
              className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full text-white text-xs"
              style={{ backgroundColor: "var(--accent)", fontSize: 10 }}
            >
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
