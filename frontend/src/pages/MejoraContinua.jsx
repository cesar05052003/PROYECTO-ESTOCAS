import { useState, useEffect } from "react";
import { RefreshCw, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getAcciones, crearAccion, actualizarAccion, cerrarAccion } from "../services/accionesCorrectivas.service";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

const estadoMap = { PENDIENTE: "neutral", EN_EJECUCION: "warning", CERRADA: "success" };
const tipoLabels = { correctiva: "Correctiva", preventiva: "Preventiva", mejora: "Mejora" };

export default function MejoraContinua() {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tipo: "correctiva", descripcion: "", responsable: "", fechaLimite: "" });

  const cargar = async () => {
    try { const { data } = await getAcciones(); setAcciones(data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearAccion(form);
      setShowModal(false);
      setForm({ tipo: "correctiva", descripcion: "", responsable: "", fechaLimite: "" });
      cargar();
    } catch (e) { alert("Error al crear acción"); }
  };

  const handleCerrar = async (id) => {
    if (!confirm("¿Cerrar esta acción?")) return;
    try {
      await cerrarAccion(id, {});
      cargar();
    } catch (e) { alert("Error al cerrar"); }
  };

  const handleCambiarEstado = async (id, estado) => {
    try {
      await actualizarAccion(id, { estado });
      cargar();
    } catch (e) { alert("Error al actualizar"); }
  };

  const total = acciones.length;
  const pendientes = acciones.filter(a => a.estado === "PENDIENTE").length;
  const enEjecucion = acciones.filter(a => a.estado === "EN_EJECUCION").length;
  const cerradas = acciones.filter(a => a.estado === "CERRADA").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Mejora Continua</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Pasos 23–24 — Acciones correctivas, preventivas y de mejora</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Nueva Acción</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: total, color: "var(--accent)" },
          { label: "Pendientes", value: pendientes, color: "var(--text-muted)" },
          { label: "En Ejecución", value: enEjecucion, color: "var(--warning)" },
          { label: "Cerradas", value: cerradas, color: "var(--success)" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{kpi.label}</div>
            <div className="text-2xl font-semibold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : acciones.length === 0 ? (
        <EmptyState icon={RefreshCw} title="Sin acciones registradas" description="Registre acciones correctivas y preventivas conforme a los Pasos 23 y 24." actionLabel="Nueva Acción" onAction={() => setShowModal(true)} />
      ) : (
        <div className="space-y-3">
          {acciones.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
                      background: a.tipo === "correctiva" ? "var(--danger-bg)" : a.tipo === "preventiva" ? "var(--warning-bg)" : "var(--info-bg)",
                      color: a.tipo === "correctiva" ? "var(--danger)" : a.tipo === "preventiva" ? "var(--warning)" : "var(--info)",
                    }}>{tipoLabels[a.tipo] || a.tipo}</span>
                    <StatusBadge status={estadoMap[a.estado]} label={a.estado.replace("_", " ")} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{a.descripcion}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>Responsable: {a.responsable}</span>
                    <span>Límite: {new Date(a.fechaLimite).toLocaleDateString("es-CO")}</span>
                    {a.usuario?.nombre && <span>Creado por: {a.usuario.nombre}</span>}
                  </div>
                  {a.incidente && (
                    <div className="mt-2 text-xs p-2 rounded" style={{ background: "var(--bg-page)", color: "var(--text-muted)" }}>
                      Incidente: {a.incidente.tipo} — {a.incidente.descripcion?.substring(0, 80)}...
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {a.estado !== "CERRADA" && (
                    <>
                      {a.estado === "PENDIENTE" && (
                        <button onClick={() => handleCambiarEstado(a.id, "EN_EJECUCION")} className="text-xs px-3 py-1.5 rounded border" style={{ borderColor: "var(--border)" }}>Iniciar</button>
                      )}
                      <button onClick={() => handleCerrar(a.id)} className="text-xs px-3 py-1.5 rounded text-white" style={{ background: "var(--success)" }}>Cerrar</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Acción">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Tipo</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="correctiva">Correctiva</option><option value="preventiva">Preventiva</option><option value="mejora">Mejora</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Descripción</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Responsable</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Fecha Límite</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fechaLimite} onChange={e => setForm({ ...form, fechaLimite: e.target.value })} required /></div>
          <button type="submit" className="btn-primary w-full">Crear Acción</button>
        </form>
      </Modal>
    </div>
  );
}
