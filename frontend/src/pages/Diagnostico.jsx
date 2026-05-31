import { useState, useEffect } from "react";
import { Plus, FileSearch, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getDiagnosticos, crearDiagnostico } from "../services/diagnostico.service";
import api from "../services/api";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

const NIVEL_CONFIG = {
  AVANZADO:   { label: "Nivel Avanzado",   color: "#4F46E5", bg: "#EEF2FF" },
  ESTANDAR:   { label: "Nivel Estándar",   color: "#0891B2", bg: "#ECFEFF" },
  BASICO:     { label: "Nivel Básico",     color: "#166534", bg: "#F0FDF4" },
  EN_PROCESO: { label: "En Proceso",       color: "#92400E", bg: "#FFFBEB" },
};

export default function Diagnostico() {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ anio: new Date().getFullYear(), descripcion: "", hallazgos: "", conclusiones: "" });
  const [madurez, setMadurez] = useState(null);
  const [expandido, setExpandido] = useState(null);

  const cargar = async () => {
    try {
      const [diag, mad] = await Promise.all([
        getDiagnosticos(),
        api.get("/diagnostico/nivel-madurez"),
      ]);
      setDiagnosticos(diag.data);
      setMadurez(mad.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearDiagnostico(form);
      setShowModal(false);
      setForm({ anio: new Date().getFullYear(), descripcion: "", hallazgos: "", conclusiones: "" });
      cargar();
    } catch (e) { alert("Error al crear diagnóstico"); }
  };

  const cfg = madurez ? NIVEL_CONFIG[madurez.nivel] : null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Diagnóstico</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 5 — Análisis de la situación actual del PESV</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo Diagnóstico</button>
      </div>

      {/* Panel de Nivel de Madurez calculado automáticamente */}
      {madurez && (
        <div className="rounded-xl border p-6 mb-8" style={{ borderColor: cfg.color, backgroundColor: cfg.bg }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-sm px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: cfg.color, color: "#fff" }}>
                  Calculado automáticamente
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Basado en los módulos con datos reales registrados en el sistema · Res. 40595 de 2022
              </p>
            </div>
          </div>

          {/* Barras de progreso por nivel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "basicos", label: "Básico (18 pasos)", color: "#166534" },
              { key: "estandar", label: "Estándar (+4 pasos)", color: "#0891B2" },
              { key: "avanzado", label: "Avanzado (+2 pasos)", color: "#4F46E5" },
            ].map(({ key, label, color }) => {
              const d = madurez[key];
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <button
                      onClick={() => setExpandido(expandido === key ? null : key)}
                      className="flex items-center gap-1 font-medium hover:underline"
                      style={{ color }}
                    >
                      {label}
                      {expandido === key ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    <span className="mono font-semibold" style={{ color }}>{d.completados}/{d.total}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.porcentaje}%`, backgroundColor: color }} />
                  </div>

                  {/* Lista expandible de pasos */}
                  {expandido === key && (
                    <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {d.pasos.map((p) => (
                        <div key={p.paso} className="flex items-start gap-2 text-xs">
                          {p.ok
                            ? <CheckCircle2 size={13} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                            : <XCircle size={13} style={{ color: "#991B1B", flexShrink: 0, marginTop: 1 }} />
                          }
                          <span style={{ color: p.ok ? "var(--text-primary)" : "#991B1B" }}>
                            <span className="font-semibold">P{p.paso}.</span> {p.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}


      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : diagnosticos.length === 0 ? (
        <EmptyState icon={FileSearch} title="Sin diagnósticos" description="Realice el diagnóstico inicial del PESV conforme al Paso 5." actionLabel="Crear Diagnóstico" onAction={() => setShowModal(true)} />
      ) : (
        <div className="space-y-4">
          {diagnosticos.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Diagnóstico {d.anio}</h3>
                <span className="text-xs px-2 py-1 rounded" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{d.riesgos?.length || 0} riesgos asociados</span>
              </div>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{d.descripcion}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Hallazgos</h4>
                  <p className="text-sm whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{d.hallazgos}</p>
                </div>
                {d.conclusiones && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Conclusiones</h4>
                    <p className="text-sm whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{d.conclusiones}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Diagnóstico">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Año</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.anio} onChange={e => setForm({ ...form, anio: parseInt(e.target.value) })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Descripción</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Hallazgos</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={4} value={form.hallazgos} onChange={e => setForm({ ...form, hallazgos: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Conclusiones</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.conclusiones} onChange={e => setForm({ ...form, conclusiones: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Guardar Diagnóstico</button>
        </form>
      </Modal>
    </div>
  );
}
