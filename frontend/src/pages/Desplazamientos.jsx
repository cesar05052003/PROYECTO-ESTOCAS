import { useState, useEffect } from "react";
import { Route, Plus } from "lucide-react";
import { getDesplazamientos, crearDesplazamiento } from "../services/desplazamientos.service";
import { getConductores } from "../services/conductores.service";
import { getVehiculos } from "../services/vehiculos.service";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

export default function Desplazamientos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState({ conductorId: "", vehiculoId: "", origen: "", destino: "", fechaSalida: "", fechaLlegada: "", distanciaKm: "", observaciones: "" });

  const cargar = async () => {
    try {
      const [d, c, v] = await Promise.all([getDesplazamientos(), getConductores(), getVehiculos()]);
      setItems(d.data);
      setConductores(Array.isArray(c.data) ? c.data : c.data.data || []);
      setVehiculos(Array.isArray(v.data) ? v.data : v.data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearDesplazamiento({ ...form, distanciaKm: form.distanciaKm ? parseFloat(form.distanciaKm) : null });
      setShowModal(false);
      setForm({ conductorId: "", vehiculoId: "", origen: "", destino: "", fechaSalida: "", fechaLlegada: "", distanciaKm: "", observaciones: "" });
      cargar();
    } catch (e) { alert("Error al registrar desplazamiento"); }
  };

  const columns = [
    { key: "conductor", label: "Conductor", render: (r) => r.conductor?.usuario?.nombre || "—" },
    { key: "vehiculo", label: "Vehículo", render: (r) => r.vehiculo ? `${r.vehiculo.placa} — ${r.vehiculo.marca}` : "—" },
    { key: "origen", label: "Origen" },
    { key: "destino", label: "Destino" },
    { key: "fechaSalida", label: "Salida", render: (r) => new Date(r.fechaSalida).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) },
    { key: "distanciaKm", label: "Km", render: (r) => r.distanciaKm ? `${r.distanciaKm} km` : "—" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Desplazamientos</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 15 — Planificación de desplazamientos laborales</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}><Plus size={16} /> Registrar</button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : items.length === 0 ? (
        <EmptyState icon={Route} title="Sin desplazamientos" description="Registre los desplazamientos laborales conforme al Paso 15." actionLabel="Registrar" onAction={() => setShowModal(true)} />
      ) : (
        <DataTable columns={columns} data={items} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Desplazamiento">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Conductor</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.conductorId} onChange={e => setForm({ ...form, conductorId: e.target.value })} required>
              <option value="">Seleccionar...</option>
              {conductores.map(c => <option key={c.id} value={c.id}>{c.usuario?.nombre} — {c.cedula}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Vehículo</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.vehiculoId} onChange={e => setForm({ ...form, vehiculoId: e.target.value })} required>
              <option value="">Seleccionar...</option>
              {vehiculos.map(v => <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Origen</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium mb-1">Destino</label><input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Fecha Salida</label><input type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fechaSalida} onChange={e => setForm({ ...form, fechaSalida: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium mb-1">Fecha Llegada</label><input type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.fechaLlegada} onChange={e => setForm({ ...form, fechaLlegada: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Distancia (Km)</label><input type="number" step="0.1" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.distanciaKm} onChange={e => setForm({ ...form, distanciaKm: e.target.value })} /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Observaciones</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Registrar</button>
        </form>
      </Modal>
    </div>
  );
}
