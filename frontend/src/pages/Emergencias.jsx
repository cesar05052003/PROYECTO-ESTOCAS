import { useState, useEffect } from "react";
import { Siren, Plus, Phone, AlertTriangle } from "lucide-react";
import { getEmergencias, crearEmergencia } from "../services/emergencias.service";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

export default function Emergencias() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: "", descripcion: "", procedimientos: "", contactosEmergencia: [] });
  const [nuevoContacto, setNuevoContacto] = useState({ nombre: "", telefono: "", entidad: "" });

  const cargar = async () => {
    try { const { data } = await getEmergencias(); setPlanes(data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const agregarContacto = () => {
    if (!nuevoContacto.nombre || !nuevoContacto.telefono) return;
    setForm({ ...form, contactosEmergencia: [...form.contactosEmergencia, { ...nuevoContacto }] });
    setNuevoContacto({ nombre: "", telefono: "", entidad: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEmergencia(form);
      setShowModal(false);
      setForm({ titulo: "", descripcion: "", procedimientos: "", contactosEmergencia: [] });
      cargar();
    } catch (e) { alert("Error al crear plan"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Plan de Emergencias</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 12 — Preparación y respuesta ante emergencias viales</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo Plan</button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : planes.length === 0 ? (
        <EmptyState icon={Siren} title="Sin plan de emergencias" description="Documente el plan de emergencias viales conforme al Paso 12." actionLabel="Crear Plan" onAction={() => setShowModal(true)} />
      ) : (
        planes.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--danger-bg)" }}><Siren size={20} style={{ color: "var(--danger)" }} /></div>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{plan.titulo}</h3>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Versión {plan.version}</span>
              </div>
            </div>

            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{plan.descripcion}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Procedimientos</h4>
                <div className="p-4 rounded-lg text-sm whitespace-pre-line" style={{ background: "var(--bg-page)", color: "var(--text-secondary)" }}>{plan.procedimientos}</div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Contactos de Emergencia</h4>
                <div className="space-y-2">
                  {plan.contactosEmergencia?.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--bg-page)" }}>
                      <Phone size={14} style={{ color: "var(--accent)" }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.nombre}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{c.entidad}</div>
                      </div>
                      <span className="text-sm font-mono font-medium" style={{ color: "var(--accent)" }}>{c.telefono}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Plan de Emergencias">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Título</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Descripción</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Procedimientos</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={4} value={form.procedimientos} onChange={e => setForm({ ...form, procedimientos: e.target.value })} required /></div>
          <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <h4 className="text-sm font-medium mb-2">Contactos de Emergencia</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input placeholder="Nombre" className="border rounded px-2 py-1.5 text-sm" value={nuevoContacto.nombre} onChange={e => setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })} />
              <input placeholder="Teléfono" className="border rounded px-2 py-1.5 text-sm" value={nuevoContacto.telefono} onChange={e => setNuevoContacto({ ...nuevoContacto, telefono: e.target.value })} />
              <input placeholder="Entidad" className="border rounded px-2 py-1.5 text-sm" value={nuevoContacto.entidad} onChange={e => setNuevoContacto({ ...nuevoContacto, entidad: e.target.value })} />
            </div>
            <button type="button" onClick={agregarContacto} className="btn-secondary text-sm w-full">+ Agregar Contacto</button>
            {form.contactosEmergencia.length > 0 && <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>{form.contactosEmergencia.length} contactos</div>}
          </div>
          <button type="submit" className="btn-primary w-full">Crear Plan</button>
        </form>
      </Modal>
    </div>
  );
}
