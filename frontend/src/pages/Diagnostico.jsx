import { useState, useEffect } from "react";
import { Search, Plus, FileSearch } from "lucide-react";
import { getDiagnosticos, crearDiagnostico } from "../services/diagnostico.service";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

export default function Diagnostico() {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ anio: new Date().getFullYear(), descripcion: "", hallazgos: "", conclusiones: "" });

  const cargar = async () => {
    try { const { data } = await getDiagnosticos(); setDiagnosticos(data); } catch (e) { console.error(e); }
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Diagnóstico</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 5 — Análisis de la situación actual del PESV</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo Diagnóstico</button>
      </div>

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
