import { useState, useEffect } from "react";
import { ClipboardCheck, Plus, AlertTriangle } from "lucide-react";
import { getAuditorias, crearAuditoria } from "../services/auditoria.service";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

const estadoMap = { EN_PROCESO: "warning", COMPLETADA: "success", PENDIENTE: "neutral" };

export default function Auditoria() {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ anio: new Date().getFullYear(), tipo: "interna", fechaInicio: "", fechaFin: "", auditor: "", hallazgos: "", noConformidades: [], recomendaciones: "" });
  const [nuevaNC, setNuevaNC] = useState({ descripcion: "", paso: "", nivel: "Menor", fechaLimite: "" });

  const cargar = async () => {
    try { const { data } = await getAuditorias(); setAuditorias(data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const agregarNC = () => {
    if (!nuevaNC.descripcion) return;
    setForm({ ...form, noConformidades: [...form.noConformidades, { ...nuevaNC, paso: parseInt(nuevaNC.paso) || 0 }] });
    setNuevaNC({ descripcion: "", paso: "", nivel: "Menor", fechaLimite: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearAuditoria(form);
      setShowModal(false);
      cargar();
    } catch (e) { alert("Error al crear auditoría"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Auditoría</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 22 — Auditoría anual del PESV</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Nueva Auditoría</button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : auditorias.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Sin auditorías" description="Registre la auditoría anual del PESV conforme al Paso 22." actionLabel="Nueva Auditoría" onAction={() => setShowModal(true)} />
      ) : (
        <div className="space-y-4">
          {auditorias.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Auditoría {a.tipo} — {a.anio}</h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{a.auditor} · {new Date(a.fechaInicio).toLocaleDateString("es-CO")} al {new Date(a.fechaFin).toLocaleDateString("es-CO")}</p>
                </div>
                <StatusBadge status={estadoMap[a.estado] || "neutral"} label={a.estado.replace("_", " ")} />
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Hallazgos</h4>
                <p className="text-sm whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{a.hallazgos}</p>
              </div>

              {a.noConformidades?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>No Conformidades ({a.noConformidades.length})</h4>
                  <div className="space-y-2">
                    {a.noConformidades.map((nc, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: nc.nivel === "Mayor" ? "var(--danger-bg)" : "var(--warning-bg)" }}>
                        <AlertTriangle size={14} style={{ color: nc.nivel === "Mayor" ? "var(--danger)" : "var(--warning)", marginTop: 2 }} />
                        <div>
                          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{nc.descripcion}</div>
                          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Paso {nc.paso} · {nc.nivel} · Límite: {nc.fechaLimite}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {a.recomendaciones && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Recomendaciones</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{a.recomendaciones}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Auditoría">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Año</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.anio} onChange={e => setForm({ ...form, anio: parseInt(e.target.value) })} required /></div>
            <div><label className="block text-sm font-medium mb-1">Tipo</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                <option value="interna">Interna</option><option value="externa">Externa</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Fecha Inicio</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium mb-1">Fecha Fin</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} required /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Auditor</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.auditor} onChange={e => setForm({ ...form, auditor: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Hallazgos</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.hallazgos} onChange={e => setForm({ ...form, hallazgos: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Recomendaciones</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={form.recomendaciones} onChange={e => setForm({ ...form, recomendaciones: e.target.value })} /></div>
          <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <h4 className="text-sm font-medium mb-2">No Conformidades</h4>
            <div className="space-y-2 mb-2">
              <input placeholder="Descripción" className="w-full border rounded px-2 py-1.5 text-sm" value={nuevaNC.descripcion} onChange={e => setNuevaNC({ ...nuevaNC, descripcion: e.target.value })} />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="Paso" className="border rounded px-2 py-1.5 text-sm" value={nuevaNC.paso} onChange={e => setNuevaNC({ ...nuevaNC, paso: e.target.value })} />
                <select className="border rounded px-2 py-1.5 text-sm" value={nuevaNC.nivel} onChange={e => setNuevaNC({ ...nuevaNC, nivel: e.target.value })}><option>Menor</option><option>Mayor</option><option>Crítica</option></select>
                <input type="date" className="border rounded px-2 py-1.5 text-sm" value={nuevaNC.fechaLimite} onChange={e => setNuevaNC({ ...nuevaNC, fechaLimite: e.target.value })} />
              </div>
            </div>
            <button type="button" onClick={agregarNC} className="btn-secondary text-sm w-full">+ Agregar NC</button>
            {form.noConformidades.length > 0 && <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>{form.noConformidades.length} no conformidades</div>}
          </div>
          <button type="submit" className="btn-primary w-full">Crear Auditoría</button>
        </form>
      </Modal>
    </div>
  );
}
