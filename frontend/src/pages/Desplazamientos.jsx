import { useState, useEffect } from "react";
import { Route, Plus, MapPin, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { getDesplazamientos, crearDesplazamiento, getEstadisticasDesplazamientos } from "../services/desplazamientos.service";
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
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    conductorId: "", vehiculoId: "", origen: "", destino: "",
    fechaSalida: "", fechaLlegada: "", distanciaKm: "", observaciones: "",
  });

  const cargar = async () => {
    try {
      const [d, c, v, s] = await Promise.all([
        getDesplazamientos(),
        getConductores(),
        getVehiculos(),
        getEstadisticasDesplazamientos(),
      ]);
      setItems(d.data);
      const condList = Array.isArray(c.data) ? c.data : c.data?.data || [];
      const vehList = Array.isArray(v.data) ? v.data : v.data?.data || [];
      // Solo mostrar activos en los dropdowns
      setConductores(condList.filter((c) => c.estado === "ACTIVO" || !c.estado));
      setVehiculos(vehList.filter((v) => v.estado === "ACTIVO"));
      setStats(s.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación en frontend antes de enviar
    if (form.fechaLlegada && form.fechaSalida && new Date(form.fechaLlegada) <= new Date(form.fechaSalida)) {
      setError("La fecha de llegada debe ser posterior a la fecha de salida.");
      return;
    }
    if (form.distanciaKm && parseFloat(form.distanciaKm) <= 0) {
      setError("La distancia debe ser mayor a 0 km.");
      return;
    }

    try {
      await crearDesplazamiento({
        ...form,
        distanciaKm: form.distanciaKm ? parseFloat(form.distanciaKm) : null,
      });
      setShowModal(false);
      setForm({ conductorId: "", vehiculoId: "", origen: "", destino: "", fechaSalida: "", fechaLlegada: "", distanciaKm: "", observaciones: "" });
      cargar();
    } catch (e) {
      setError(e.response?.data?.error || "Error al registrar el desplazamiento.");
    }
  };

  const columns = [
    { key: "conductor", label: "Conductor", render: (r) => r.conductor?.usuario?.nombre || "—" },
    { key: "vehiculo", label: "Vehículo", render: (r) => r.vehiculo ? `${r.vehiculo.placa} — ${r.vehiculo.marca}` : "—" },
    { key: "origen", label: "Origen" },
    { key: "destino", label: "Destino" },
    { key: "fechaSalida", label: "Salida", render: (r) => new Date(r.fechaSalida).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) },
    { key: "fechaLlegada", label: "Llegada", render: (r) => r.fechaLlegada ? new Date(r.fechaLlegada).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }) : <span className="text-yellow-600 font-medium text-xs">En ruta</span> },
    { key: "distanciaKm", label: "Km", render: (r) => r.distanciaKm ? `${r.distanciaKm} km` : "—" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Desplazamientos</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 15 — Planificación de desplazamientos laborales</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setError(""); setShowModal(true); }}>
          <Plus size={16} /> Registrar
        </button>
      </div>

      {/* Panel de estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 flex items-center gap-3">
            <TrendingUp size={20} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total km recorridos</p>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.totalKm.toLocaleString("es-CO")} km</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Route size={20} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total viajes</p>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.totalViajes}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <MapPin size={20} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Km promedio/viaje</p>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.promedioKmPorViaje} km</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <Calendar size={20} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Viajes este mes</p>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.viajesEsteMes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top conductores */}
      {stats?.topConductores?.length > 0 && (
        <div className="card p-4 mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Conductores más activos</h3>
          <div className="flex flex-wrap gap-3">
            {stats.topConductores.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "var(--surface-alt)" }}>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c.nombre}</span>
                <span style={{ color: "var(--text-muted)" }}>·</span>
                <span style={{ color: "var(--text-muted)" }}>{c.viajes} viajes · {c.km} km</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : items.length === 0 ? (
        <EmptyState icon={Route} title="Sin desplazamientos" description="Registre los desplazamientos laborales conforme al Paso 15." actionLabel="Registrar" onAction={() => setShowModal(true)} />
      ) : (
        <DataTable columns={columns} data={items} />
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setError(""); }} title="Registrar Desplazamiento">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Conductor <span className="text-xs text-gray-400">(solo activos)</span></label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.conductorId} onChange={e => setForm({ ...form, conductorId: e.target.value })} required>
              <option value="">Seleccionar...</option>
              {conductores.map(c => <option key={c.id} value={c.id}>{c.usuario?.nombre} — {c.cedula}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vehículo <span className="text-xs text-gray-400">(solo activos)</span></label>
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
          <div>
            <label className="block text-sm font-medium mb-1">Distancia (km)</label>
            <input type="number" step="0.1" min="0.1" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.distanciaKm} onChange={e => setForm({ ...form, distanciaKm: e.target.value })} />
          </div>
          <div><label className="block text-sm font-medium mb-1">Observaciones</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full">Registrar</button>
        </form>
      </Modal>
    </div>
  );
}
