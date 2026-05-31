import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Sparkles, FileText, AlertTriangle,
  GraduationCap, Truck, Users, ClipboardList,
  Shield, LogOut, Users2, FileSearch, Target,
  CalendarDays, Siren, Route, Wrench,
  BarChart3, ClipboardCheck, RefreshCw,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useRole } from "../../hooks/useRole";

const gruposCompletos = [
  {
    label: "PLANIFICACIÓN",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/comite", icon: Users2, label: "Comité" },
      { to: "/documentos", icon: FileText, label: "Documentos" },
      { to: "/diagnostico", icon: FileSearch, label: "Diagnóstico" },
      { to: "/riesgos", icon: AlertTriangle, label: "Riesgos" },
    ],
  },
  {
    label: "IMPLEMENTACIÓN",
    items: [
      { to: "/plan-trabajo", icon: CalendarDays, label: "Plan de Trabajo" },
      { to: "/capacitaciones", icon: GraduationCap, label: "Capacitaciones" },
      { to: "/emergencias", icon: Siren, label: "Emergencias" },
      { to: "/incidentes", icon: ClipboardList, label: "Incidentes" },
      { to: "/desplazamientos", icon: Route, label: "Desplazamientos" },
      { to: "/vehiculos", icon: Truck, label: "Vehículos" },
      { to: "/conductores", icon: Users, label: "Conductores" },
      { to: "/usuarios", icon: Shield, label: "Usuarios" },
    ],
  },
  {
    label: "SEGUIMIENTO",
    items: [
      { to: "/reportes", icon: BarChart3, label: "Indicadores" },
      { to: "/auditoria", icon: ClipboardCheck, label: "Auditoría" },
    ],
  },
  {
    label: "MEJORA CONTINUA",
    items: [
      { to: "/mejora-continua", icon: RefreshCw, label: "Acciones" },
    ],
  },
  {
    label: "",
    items: [
      { to: "/asistente", icon: Sparkles, label: "IA Asistente" },
    ],
  },
];

const rolLabels = { ADMINISTRADOR: "Administrador", LIDER: "Líder PESV", GERENTE: "Gerente", CONDUCTOR: "Conductor" };

export default function Sidebar({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { isGerente, isConductor, isAdmin, isLider } = useRole();

  const getVisibleGrupos = () => {
    if (isAdmin() || isLider()) return gruposCompletos;

    if (isGerente()) {
      return [
        { label: "PLANIFICACIÓN", items: [gruposCompletos[0].items[0]] },
        { label: "SEGUIMIENTO", items: gruposCompletos[2].items },
        gruposCompletos[4],
      ];
    }

    if (isConductor()) {
      return [
        { label: "PLANIFICACIÓN", items: [gruposCompletos[0].items[0]] },
        {
          label: "IMPLEMENTACIÓN",
          items: gruposCompletos[1].items.filter((item) =>
            ["/capacitaciones", "/incidentes", "/desplazamientos"].includes(item.to)
          ),
        },
      ];
    }

    return gruposCompletos;
  };

  const getFilteredGrupos = () => {
    const grupos = getVisibleGrupos();
    if (!isAdmin()) {
      return grupos.map(grupo => ({
        ...grupo,
        items: grupo.items.filter(item => item.to !== "/usuarios")
      }));
    }
    return grupos;
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
          {getFilteredGrupos().map((grupo, gi) => (
            <div key={gi} className="mb-4">
              {grupo.label && (
                <div
                  className="px-2 mb-1 font-semibold tracking-wider uppercase"
                  style={{ color: "rgba(203,213,225,0.5)", fontSize: 10, letterSpacing: "0.08em" }}
                >
                  {grupo.label}
                </div>
              )}
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
                    borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                    paddingLeft: isActive ? 14 : 12,
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
