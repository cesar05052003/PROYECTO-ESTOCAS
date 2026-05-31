import { useState, useEffect, useCallback } from "react";
import { Plus, Zap, AlertCircle, Calendar, ShieldOff, CheckCircle2, Lock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import KpiCard from "../components/ui/KpiCard";
import Modal from "../components/ui/Modal";
import ClaudeButton from "../components/ia/ClaudeButton";
import ClaudeOutputModal from "../components/ia/ClaudeOutputModal";
import { getIncidentes, getEstadisticas, crearIncidente, actualizarIncidente } from "../services/incidentes.service";
import { getConductores } from "../services/conductores.service";
import { getVehiculos } from "../services/vehiculos.service";
import { investigarIncidente } from "../services/ia.service";
import { useRole } from "../hooks/useRole";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO");
const PIE_COLORS = { ACCIDENTE_SOLO_DANOS: "#991B1B", ACCIDENTE_CON_LESIONADOS: "#7F1D1D", ACCIDENTE_CON_MUERTOS: "#450A0A", CASI_ACCIDENTE: "#1B6CA8", INFRACCION_TRANSITO: "#92400E" };

export default function Incidentes() {
  const { isAdmin, isLider } = useRole();
  const [incidentes, setIncidentes] = useState([]);
  const [stats, setStats] = useState(null);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [iaLoading, setIaLoading] = useState(null);
  const [cerrando, setCerrando] = useState(null);
  const [iaModal, setIaModal] = useState(false);
  const [iaContenido, setIaContenido] = useState("");
  const [form, setForm] = useState({ tipo: "ACCIDENTE_SOLO_DANOS", descripcion: "", fecha: "", lugar: "", municipio: "Montería", vehiculoId: "", conductorId: "", lesionados: 0, muertos: 0, costoEstimado: "", severidad: "MODERADO" });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [inc, stat] = await Promise.all([getIncidentes({ page }), getEstadisticas()]);
      const lista = inc.data.data || (Array.isArray(inc.data) ? inc.data : []);
      setIncidentes(lista);
      setTotal(inc.data.total || lista.length);
      setPages(inc.data.pages || 1);
      setStats(stat.data);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => {
    getConductores().then(({ data }) => setConductores(Array.isArray(data) ? data : data.data || []));
    getVehiculos().then(({ data }) => setVehiculos(Array.isArray(data) ? data : data.data || []));
  }, []);

  const handleInvestigar = async (incidenteId) => {
    setIaLoading(incidenteId);
    try {
      const { data } = await investigarIncidente(incidenteId);
      setIaContenido(data.investigacion);
      setIaModal(true);
      cargar();
    } catch {
      alert("Error al generar investigación. Verifica tu clave API.");
    } finally {
      setIaLoading(null);
    }
  };

  const handleCerrar = async (incidenteId) => {
    if (!window.confirm("¿Confirmar cierre del incidente? Asegúrese de que la investigación y las acciones correctivas estén registradas.")) return;
    setCerrando(incidenteId);
    try {
      await actualizarIncidente(incidenteId, { estado: "CERRADO" });
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "No se puede cerrar el incidente. Verifique que tenga investigación y acciones correctivas.");
    } finally {
      setCerrando(null);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearIncidente(form);
      setModalNuevo(false);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al registrar incidente");
    }
  };

  const porMesData = (stats?.porMes || []).map((d) => ({
    mes: d.mes,
    Accidentes: Number(d.accidentes || 0),
    "Casi-accidentes": Number(d.casi_accidentes || 0),
  }));

  const porTipoData = (stats?.porTipo || []).map((d) => ({
    name: d.tipo.replace("_", " "),
    value: d._count.id,
    fill: PIE_COLORS[d.tipo] || "#6B7280",
  }));

  const columns = [
    {
      key: "id", title: "ID",
      render: (_, row) => <span className="mono text-xs" style={{ color: "var(--text-muted)" }}>INC-{row.id.slice(-3).toUpperCase()}</span>,
    },
    { key: "fecha", title: "Fecha", render: (v) => <span className="text-xs">{fmtFecha(v)}</span> },
    {
      key: "tipo", title: "Tipo",
      render: (v) => <span className="text-xs font-medium">{v.replace("_", " ")}</span>,
    },
    {
      key: "conductor", title: "Conductor",
      render: (v) => <span className="text-xs">{v?.usuario?.nombre || "—"}</span>,
    },
    {
      key: "vehiculo", title: "Vehículo",
      render: (v) => v ? <span className="mono text-xs">{v.placa}</span> : <span style={{ color: "var(--text-muted)" }}>—</span>,
    },
    {
      key: "lugar", title: "Lugar",
      render: (v) => <span className="text-xs" style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", display: "block", whiteSpace: "nowrap" }}>{v}</span>,
    },
    { key: "severidad", title: "Severidad", render: (v) => <StatusBadge status={v} size="xs" /> },
    { key: "estado", title: "Estado", render: (v) => <StatusBadge status={v} size="xs" /> },
    ...(isAdmin() || isLider()
      ? [{
        key: "acciones", title: "Acciones",
        render: (_, row) => {
          if (row.estado === "CERRADO") {
            return (
              <div className="flex items-center gap-1 text-xs" style={{ color: "var(--success)" }}>
                <Lock size={12} /> Cerrado
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <ClaudeButton
                onClick={() => handleInvestigar(row.id)}
                loading={iaLoading === row.id}
                label="IA"
                className="text-xs px-2 py-1"
                title="Generar investigación con IA"
              />
              {row.estado === "EN_INVESTIGACION" && (
                <button
                  onClick={() => handleCerrar(row.id)}
                  disabled={cerrando === row.id}
                  title="Cerrar incidente (requiere investigación + acciones correctivas)"
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors hover:bg-green-50"
                  style={{ borderColor: "#166534", color: "#166534" }}
                >
                  <CheckCircle2 size={12} />
                  {cerrando === row.id ? "..." : "Cerrar"}
                </button>
              )}
            </div>
          );
        },
      }]
      : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Registro de Incidentes"
        subtitle="Accidentes, casi-accidentes e infracciones · Paso 13 Resolución 40595"
        actions={
          <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <Plus size={15} /> Registrar
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={AlertCircle} value={stats?.totalMes ?? null} label="Incidentes este mes" accentColor="var(--danger)" loading={loading} />
          <KpiCard icon={Zap} value={stats?.totalAnio ?? null} label="Total año" accentColor="var(--accent)" loading={loading} />
          <KpiCard
            icon={ShieldOff}
            value={stats?.porTipo?.find((t) => t.tipo === "CASI_ACCIDENTE")?._count?.id ?? 0}
            label="Casi-accidentes año"
            accentColor="#92400E"
            loading={loading}
          />
          <KpiCard
            icon={Calendar}
            value={stats?.diasSinAccidente != null ? stats.diasSinAccidente : "—"}
            label="Días sin accidente"
            accentColor="#166534"
            loading={loading}
          />
        </div>

        <DataTable
          columns={columns}
          data={incidentes}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={setPage}
          emptyTitle="Sin incidentes registrados"
          emptySubtitle="Registra el primer incidente para comenzar el seguimiento"
        />

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Incidentes por mes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={porMesData} margin={{ left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Bar dataKey="Accidentes" fill="#991B1B" radius={[4,4,0,0]} />
                <Bar dataKey="Casi-accidentes" fill="#1B6CA8" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Distribución por tipo</h3>
            {porTipoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={porTipoData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {porTipoData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-muted)" }}>Sin datos de incidentes</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal registrar incidente */}
      <Modal
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        title="Registrar incidente vial"
        size="md"
        footer={
          <>
            <button onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancelar</button>
            <button onClick={handleCrear} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>Registrar</button>
          </>
        }
      >
        <form onSubmit={handleCrear} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="ACCIDENTE_SOLO_DANOS">Accidente solo daños</option>
                <option value="ACCIDENTE_CON_LESIONADOS">Accidente con lesionados</option>
                <option value="ACCIDENTE_CON_MUERTOS">Accidente con muertos</option>
                <option value="CASI_ACCIDENTE">Casi-accidente</option>
                <option value="INFRACCION_TRANSITO">Infracción de tránsito</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Severidad</label>
              <select value={form.severidad} onChange={(e) => setForm({ ...form, severidad: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="BAJO">Bajo</option>
                <option value="MODERADO">Moderado</option>
                <option value="ALTO">Alto</option>
                <option value="CRITICO">Crítico</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Fecha</label>
              <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Municipio</label>
              <input value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Lugar exacto</label>
            <input value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} required placeholder="Ej: Cra 15 con Cll 23, Montería" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Conductor</label>
              <select value={form.conductorId} onChange={(e) => setForm({ ...form, conductorId: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="">Seleccionar...</option>
                {conductores.map((c) => <option key={c.id} value={c.id}>{c.usuario?.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vehículo</label>
              <select value={form.vehiculoId} onChange={(e) => setForm({ ...form, vehiculoId: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="">Seleccionar...</option>
                {vehiculos.map((v) => <option key={v.id} value={v.id}>{v.placa} — {v.marca}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Descripción del evento</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={4} required className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Lesionados</label>
              <input type="number" min={0} value={form.lesionados} onChange={(e) => setForm({ ...form, lesionados: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Muertos</label>
              <input type="number" min={0} value={form.muertos} onChange={(e) => setForm({ ...form, muertos: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Costo estimado $</label>
              <input type="number" min={0} value={form.costoEstimado} onChange={(e) => setForm({ ...form, costoEstimado: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
        </form>
      </Modal>

      <ClaudeOutputModal open={iaModal} onClose={() => setIaModal(false)} contenido={iaContenido} />
    </div>
  );
}
