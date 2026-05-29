import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Sparkles, FileText, AlertTriangle,
  GraduationCap, Truck, Users, ClipboardList,
  Shield, LogOut, ChevronRight,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useRole } from "../../hooks/useRole";

const gruposCompletos = [
  {
    label: "GENERAL",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/asistente", icon: Sparkles, label: "Asistente IA" },
    ],
  },
  {
    label: "GESTIÓN PESV",
    items: [
      { to: "/documentos", icon: FileText, label: "Documentos" },
      { to: "/riesgos", icon: AlertTriangle, label: "Riesgos" },
      { to: "/capacitaciones", icon: GraduationCap, label: "Capacitaciones" },
    ],
  },
  {
    label: "OPERACIONES",
    items: [
      { to: "/vehiculos", icon: Truck, label: "Vehículos" },
      { to: "/conductores", icon: Users, label: "Conductores" },
      { to: "/incidentes", icon: ClipboardList, label: "Incidentes" },
    ],
  },
];

const rolLabels = { ADMIN: "Administrador", LIDER_PESV: "Líder PESV", GERENTE: "Gerente", CONDUCTOR: "Conductor" };

export default function Sidebar({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { isGerente, isConductor, isAdmin, isLider } = useRole();

  const getVisibleGrupos = () => {
    if (isAdmin() || isLider()) return gruposCompletos;

    if (isGerente()) {
      return [gruposCompletos[0]];
    }

    if (isConductor()) {
      return [
        gruposCompletos[0],
        {
          label: "OPERACIONES",
          items: gruposCompletos[2].items.filter((item) =>
            item.to === "/capacitaciones" || item.to === "/incidentes"
          ),
        },
      ];
    }

    return gruposCompletos;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 240, backgroundColor: "var(--sidebar-bg)", minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: "var(--accent)" }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm leading-tight">PESV Digital</div>
            <div className="text-xs" style={{ color: "var(--sidebar-text)" }}>TransCor S.A.S.</div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {getVisibleGrupos().map((grupo) => (
            <div key={grupo.label} className="mb-4">
              <div
                className="px-2 mb-1 text-xs font-semibold tracking-wider uppercase"
                style={{ color: "rgba(203,213,225,0.5)", fontSize: 10 }}
              >
                {grupo.label}
              </div>
              {grupo.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => window.innerWidth < 1024 && onClose?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all
                    ${isActive
                      ? "text-white font-medium"
                      : "hover:text-white"
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
                    color: isActive ? "var(--sidebar-active-text)" : "var(--sidebar-text)",
                    borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                  })}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Usuario + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {user?.nombre?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.nombre || "Usuario"}</div>
              <div className="text-xs truncate" style={{ color: "var(--sidebar-text)" }}>
                {rolLabels[user?.rol] || user?.rol}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:text-white"
            style={{ color: "var(--sidebar-text)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--sidebar-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
