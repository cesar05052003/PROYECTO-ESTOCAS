import { useState, useEffect } from "react";
import { CalendarDays, Plus, CheckCircle2, Clock, Circle } from "lucide-react";
import { getPlanes, crearPlan, actualizarPlan } from "../services/planTrabajo.service";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

const estadoColor = { COMPLETADA: "success", EN_EJECUCION: "warning", PENDIENTE: "neutral" };
const estadoIcon = { COMPLETADA: CheckCircle2, EN_EJECUCION: Clock, PENDIENTE: Circle };

export default function PlanTrabajo() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ anio: new Date().getFullYear(), objetivos: "", actividades: [] });
  const [nuevaAct, setNuevaAct] = useState({ nombre: "", responsable: "", fechaInicio: "", fechaFin: "", estado: "PENDIENTE", presupuesto: 0 });

  const cargar = async () => {
    try { const { data } = await getPlanes(); setPlanes(data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const agregarActividad = () => {
    if (!nuevaAct.nombre) return;
    setForm({ ...form, actividades: [...form.actividades, { ...nuevaAct }] });
    setNuevaAct({ nombre: "", responsable: "", fechaInicio: "", fechaFin: "", estado: "PENDIENTE", presupuesto: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearPlan(form);
      setShowModal(false);
      setForm({ anio: new Date().getFullYear(), objetivos: "", actividades: [] });
      cargar();
    } catch (e) { alert("Error al crear plan"); }
  };

  const cambiarEstadoActividad = async (plan, actIndex, nuevoEstado) => {
    const actividades = [...plan.actividades];
    actividades[actIndex].estado = nuevoEstado;
    try {
      await actualizarPlan(plan.id, { actividades });
      cargar();
    } catch (e) { alert("Error al actualizar"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Plan Anual de Trabajo</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 9 — Cronograma de actividades PESV</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo Plan</button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : planes.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Sin plan de trabajo" description="Cree el plan anual de trabajo conforme al Paso 9." actionLabel="Crear Plan" onAction={() => setShowModal(true)} />
      ) : (
        planes.map((plan) => {
          const total = plan.actividades?.length || 0;
          const completadas = plan.actividades?.filter(a => a.estado === "COMPLETADA").length || 0;
          const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;

          return (
            <div key={plan.id} className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Plan {plan.anio}</h3>
                  <StatusBadge status={plan.estado === "EN_EJECUCION" ? "warning" : "success"} label={plan.estado.replace("_", " ")} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>{pct}%</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{completadas}/{total} actividades</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full mb-4" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--accent)" }} />
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Objetivos</h4>
                <p className="text-sm whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{plan.objetivos}</p>
              </div>

              {/* Actividades como timeline */}
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Actividades</h4>
              <div className="space-y-2">
                {plan.actividades?.map((act, i) => {
                  const Icon = estadoIcon[act.estado] || Circle;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--bg-page)" }}>
                      <Icon size={16} style={{ color: act.estado === "COMPLETADA" ? "var(--success)" : act.estado === "EN_EJECUCION" ? "var(--warning)" : "var(--text-muted)" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{act.nombre}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{act.responsable} · {act.fechaInicio} → {act.fechaFin}</div>
                      </div>
                      <select
                        value={act.estado}
                        onChange={(e) => cambiarEstadoActividad(plan, i, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_EJECUCION">En ejecución</option>
                        <option value="COMPLETADA">Completada</option>
                      </select>
                      {act.presupuesto > 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>${Number(act.presupuesto).toLocaleString()}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Plan Anual">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Año</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.anio} onChange={e => setForm({ ...form, anio: parseInt(e.target.value) })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Objetivos</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.objetivos} onChange={e => setForm({ ...form, objetivos: e.target.value })} required /></div>
          
          <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <h4 className="text-sm font-medium mb-2">Agregar Actividad</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input placeholder="Nombre" className="border rounded px-2 py-1.5 text-sm" value={nuevaAct.nombre} onChange={e => setNuevaAct({ ...nuevaAct, nombre: e.target.value })} />
              <input placeholder="Responsable" className="border rounded px-2 py-1.5 text-sm" value={nuevaAct.responsable} onChange={e => setNuevaAct({ ...nuevaAct, responsable: e.target.value })} />
              <input type="date" className="border rounded px-2 py-1.5 text-sm" value={nuevaAct.fechaInicio} onChange={e => setNuevaAct({ ...nuevaAct, fechaInicio: e.target.value })} />
              <input type="date" className="border rounded px-2 py-1.5 text-sm" value={nuevaAct.fechaFin} onChange={e => setNuevaAct({ ...nuevaAct, fechaFin: e.target.value })} />
            </div>
            <button type="button" onClick={agregarActividad} className="btn-secondary text-sm w-full">+ Agregar</button>
            {form.actividades.length > 0 && (
              <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>{form.actividades.length} actividades agregadas</div>
            )}
          </div>
          <button type="submit" className="btn-primary w-full">Crear Plan</button>
        </form>
      </Modal>
    </div>
  );
}
