import { useState, useEffect } from "react";
import { Users, Plus, Calendar, FileText, Trash2 } from "lucide-react";
import { getComite, crearComite, agregarMiembro, eliminarMiembro, crearReunion } from "../services/comite.service";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

export default function Comite() {
  const [comite, setComite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMiembroModal, setShowMiembroModal] = useState(false);
  const [showReunionModal, setShowReunionModal] = useState(false);
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [form, setForm] = useState({});

  const cargar = async () => {
    try {
      const { data } = await getComite();
      setComite(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleCrearComite = async (e) => {
    e.preventDefault();
    try {
      await crearComite(form);
      setShowCrearModal(false);
      setForm({});
      cargar();
    } catch (e) { alert("Error al crear comité"); }
  };

  const handleAgregarMiembro = async (e) => {
    e.preventDefault();
    try {
      await agregarMiembro({ ...form, comiteId: comite.id });
      setShowMiembroModal(false);
      setForm({});
      cargar();
    } catch (e) { alert("Error al agregar miembro"); }
  };

  const handleEliminarMiembro = async (id) => {
    if (!confirm("¿Eliminar este miembro?")) return;
    try {
      await eliminarMiembro(id);
      cargar();
    } catch (e) { alert("Error al eliminar"); }
  };

  const handleCrearReunion = async (e) => {
    e.preventDefault();
    try {
      await crearReunion({ ...form, comiteId: comite.id });
      setShowReunionModal(false);
      setForm({});
      cargar();
    } catch (e) { alert("Error al crear reunión"); }
  };

  if (loading) return <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Cargando...</div>;

  if (!comite) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Comité de Seguridad Vial</h1>
        </div>
        <EmptyState icon={Users} title="No hay comité constituido" description="Constituya el Comité de Seguridad Vial conforme al Paso 2 de la Resolución 40595." actionLabel="Constituir Comité" onAction={() => setShowCrearModal(true)} />
        <Modal isOpen={showCrearModal} onClose={() => setShowCrearModal(false)} title="Constituir Comité">
          <form onSubmit={handleCrearComite} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Nombre del Comité</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.nombre || ""} onChange={e => setForm({ ...form, nombre: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium mb-1">Fecha de Constitución</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fechaCreacion || ""} onChange={e => setForm({ ...form, fechaCreacion: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium mb-1">Acta de Constitución</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.acta || ""} onChange={e => setForm({ ...form, acta: e.target.value })} /></div>
            <button type="submit" className="btn-primary w-full">Constituir Comité</button>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Comité de Seguridad Vial</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 2 — Resolución 40595 de 2022</p>
        </div>
      </div>

      {/* Info del comité */}
      <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{comite.nombre}</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Constituido el {new Date(comite.fechaCreacion).toLocaleDateString("es-CO")}</p>
        {comite.acta && <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>{comite.acta}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Miembros */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Miembros ({comite.miembros?.length || 0})</h3>
            <button className="btn-primary text-sm flex items-center gap-1" onClick={() => { setForm({}); setShowMiembroModal(true); }}><Plus size={14} /> Agregar</button>
          </div>
          <div className="space-y-3">
            {comite.miembros?.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-page)" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{m.nombre}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{m.cargo}</div>
                </div>
                <div className="flex items-center gap-2">
                  {m.esLider && <StatusBadge status="success" label="Líder" />}
                  <button onClick={() => handleEliminarMiembro(m.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reuniones */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Reuniones ({comite.reuniones?.length || 0})</h3>
            <button className="btn-primary text-sm flex items-center gap-1" onClick={() => { setForm({}); setShowReunionModal(true); }}><Plus size={14} /> Nueva</button>
          </div>
          <div className="space-y-3">
            {comite.reuniones?.map((r) => (
              <div key={r.id} className="p-3 rounded-lg" style={{ background: "var(--bg-page)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{new Date(r.fecha).toLocaleDateString("es-CO")}</span>
                </div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{r.tema}</div>
                {r.acta && <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{r.acta.substring(0, 100)}...</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Miembro */}
      <Modal isOpen={showMiembroModal} onClose={() => setShowMiembroModal(false)} title="Agregar Miembro">
        <form onSubmit={handleAgregarMiembro} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Nombre</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.nombre || ""} onChange={e => setForm({ ...form, nombre: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Cargo</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.cargo || ""} onChange={e => setForm({ ...form, cargo: e.target.value })} required /></div>
          <div className="flex items-center gap-2"><input type="checkbox" checked={form.esLider || false} onChange={e => setForm({ ...form, esLider: e.target.checked })} /><label className="text-sm">Es Líder del PESV</label></div>
          <button type="submit" className="btn-primary w-full">Agregar Miembro</button>
        </form>
      </Modal>

      {/* Modal Reunión */}
      <Modal isOpen={showReunionModal} onClose={() => setShowReunionModal(false)} title="Nueva Reunión">
        <form onSubmit={handleCrearReunion} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Fecha</label><input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fecha || ""} onChange={e => setForm({ ...form, fecha: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Tema</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.tema || ""} onChange={e => setForm({ ...form, tema: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium mb-1">Acta</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={4} value={form.acta || ""} onChange={e => setForm({ ...form, acta: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Registrar Reunión</button>
        </form>
      </Modal>
    </div>
  );
}
