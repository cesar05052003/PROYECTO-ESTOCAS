import { useState, useEffect } from "react";
import { Users, Truck, ClipboardList, CheckSquare, Bell, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import Header from "../components/layout/Header";
import KpiCard from "../components/ui/KpiCard";
import StatusBadge from "../components/ui/StatusBadge";
import ClaudeButton from "../components/ia/ClaudeButton";
import ClaudeOutputModal from "../components/ia/ClaudeOutputModal";
import api from "../services/api";
import { generarInformeEjecutivo } from "../services/ia.service";
import { crearDocumento } from "../services/documentos.service";
import useAuthStore from "../store/authStore";
import { useRole } from "../hooks/useRole";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const tipoAlertaLabel = {
  SOAT_VENCIDO: "SOAT Vencido", SOAT_PROXIMO: "SOAT Próximo",
  TECNOMECANICA_VENCIDA: "Tecno-Mecánica Vencida", TECNOMECANICA_PROXIMA: "Tecno-Mecánica Próxima",
  LICENCIA_VENCIDA: "Licencia Vencida", LICENCIA_PROXIMA: "Licencia Próxima",
  INCIDENTE_SIN_INVESTIGAR: "Incidente sin Investigar",
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { isGerente } = useRole();
  const [kpis, setKpis] = useState(null);
  const [accidentalidad, setAccidentalidad] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [cumplimiento, setCumplimiento] = useState([]);
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaModal, setIaModal] = useState(false);
  const [iaContenido, setIaContenido] = useState("");
  const [savingDoc, setSavingDoc] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
  const hoy = new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/kpis"),
      api.get("/dashboard/accidentalidad"),
      api.get("/dashboard/alertas"),
      api.get("/dashboard/cumplimiento"),
      api.get("/incidentes?page=1"),
    ]).then(([k, acc, al, cum, inc]) => {
      setKpis(k.data);
      setAccidentalidad(acc.data.map((d) => ({
        mes: d.mes,
        accidentes: Number(d.accidentes),
        casiAccidentes: Number(d.casiAccidentes),
      })));
      setAlertas(al.data);
      setCumplimiento(cum.data);
      setIncidentes(inc.data.data?.slice(0, 5) || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleInformeIA = async () => {
    setIaLoading(true);
    try {
      const { data } = await generarInformeEjecutivo();
      setIaContenido(data.contenido);
      setIaModal(true);
    } catch {
      alert("Error al generar informe. Verifica tu clave API.");
    } finally {
      setIaLoading(false);
    }
  };

  const handleGuardarDoc = async () => {
    setSavingDoc(true);
    try {
      await crearDocumento({
        titulo: `Informe Ejecutivo PESV — ${new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" })}`,
        categoria: "Indicadores",
        contenido: iaContenido,
        estado: "BORRADOR",
        generadoIA: true,
        pasoResolucion: 20,
      });
      setIaModal(false);
    } finally {
      setSavingDoc(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title={`${saludo}, ${user?.nombre?.split(" ")[0] || ""}` }
        subtitle={`${hoy} · TransCor S.A.S.`}
        alertCount={alertas.filter((a) => !a.leida).length}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        actions={!isGerente() && <ClaudeButton onClick={handleInformeIA} loading={iaLoading} label="Informe Ejecutivo" />}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={Users}
            value={kpis ? `${kpis.conductoresActivos}/${kpis.totalConductores}` : null}
            label="Conductores activos"
            accentColor="#166534"
            loading={loading}
          />
          <KpiCard
            icon={Truck}
            value={kpis ? `${kpis.vehiculosOperativos}/${kpis.totalVehiculos}` : null}
            label="Vehículos operativos"
            accentColor="var(--accent)"
            loading={loading}
          />
          <KpiCard
            icon={ClipboardList}
            value={kpis?.incidentesMes ?? null}
            label="Incidentes este mes"
            trend={kpis?.tendenciaIncidentes}
            trendLabel={kpis ? (kpis.tendenciaIncidentes === 0 ? "Igual al mes anterior" : `${Math.abs(kpis.tendenciaIncidentes)} vs mes anterior`) : ""}
            accentColor="var(--danger)"
            loading={loading}
          />
          <KpiCard
            icon={CheckSquare}
            value={kpis ? `${kpis.cumplimiento}%` : null}
            label="Cumplimiento PESV"
            accentColor={kpis?.cumplimiento >= 80 ? "#166534" : kpis?.cumplimiento >= 60 ? "#92400E" : "#991B1B"}
            loading={loading}
          />
        </div>

        {/* Gráficas row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accidentalidad */}
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Accidentalidad</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Últimos 6 meses</p>
              </div>
              <TrendingUp size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            {loading ? (
              <div className="h-44 bg-gray-100 rounded pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
                <AreaChart data={accidentalidad} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#991B1B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#991B1B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCasi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B6CA8" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1B6CA8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Area type="monotone" dataKey="accidentes" name="Accidentes" stroke="#991B1B" strokeWidth={2} fill="url(#gAcc)" />
                  <Area type="monotone" dataKey="casiAccidentes" name="Casi-accidentes" stroke="#1B6CA8" strokeWidth={2} fill="url(#gCasi)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Alertas activas */}
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Alertas activas</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{alertas.length} pendientes de atención</p>
              </div>
              <Bell size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded pulse" />)}</div>
            ) : alertas.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm" style={{ color: "var(--text-muted)" }}>
                Sin alertas activas
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 220 }}>
                {alertas.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-input)" }}>
                    <AlertTriangle size={14} style={{ color: "var(--danger)", marginTop: 2, flexShrink: 0 }} />
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {tipoAlertaLabel[a.tipo] || a.tipo}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.mensaje}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cumplimiento por módulo */}
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Cumplimiento por módulo PESV</h3>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {cumplimiento.map((m) => (
                  <div key={m.nombre}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--text-secondary)" }}>{m.nombre}</span>
                      <span className="font-medium mono" style={{ color: "var(--text-primary)" }}>{m.porcentaje}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F3F4F6" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${m.porcentaje}%`, backgroundColor: m.porcentaje >= 80 ? "#166534" : m.porcentaje >= 60 ? "#92400E" : "#991B1B" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Últimos incidentes */}
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Últimos incidentes</h3>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded pulse" />)}</div>
            ) : incidentes.length === 0 ? (
              <div className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Sin incidentes registrados</div>
            ) : (
              <div className="space-y-2">
                {incidentes.map((inc) => (
                  <div key={inc.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#F3F4F6" }}>
                    <div>
                      <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                        {inc.tipo.replace("_", " ")} · {inc.lugar}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{fmtFecha(inc.fecha)}</div>
                    </div>
                    <StatusBadge status={inc.severidad} size="xs" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ClaudeOutputModal
        open={iaModal}
        onClose={() => setIaModal(false)}
        contenido={iaContenido}
        onSave={handleGuardarDoc}
        saving={savingDoc}
      />
    </div>
  );
}
