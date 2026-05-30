import { useState, useEffect, useCallback } from "react";
import { Plus, Truck, AlertTriangle } from "lucide-react";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import { getVehiculos, crearVehiculo, getVehiculo } from "../services/vehiculos.service";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO");
const fmtKm = (n) => n?.toLocaleString("es-CO") + " km";

const getAlertaStatus = (fecha) => {
  const dias = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24));
  if (dias < 0) return "danger";
  if (dias <= 30) return "warning";
  return null;
};

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertas, setAlertas] = useState({ vencidos: 0, proximos: 0 });
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalFicha, setModalFicha] = useState(false);
  const [fichaVehiculo, setFichaVehiculo] = useState(null);
  const [form, setForm] = useState({ placa: "", marca: "", modelo: "", anio: new Date().getFullYear(), tipo: "Camión", kilometraje: 0, soatVencimiento: "", tecnomecanicaVencimiento: "", estado: "ACTIVO" });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getVehiculos();
      const lista = Array.isArray(data) ? data : data.data || [];
      setVehiculos(lista);
      const venc = lista.filter((v) => getAlertaStatus(v.soatVencimiento) === "danger" || getAlertaStatus(v.tecnomecanicaVencimiento) === "danger").length;
      const prox = lista.filter((v) => getAlertaStatus(v.soatVencimiento) === "warning" || getAlertaStatus(v.tecnomecanicaVencimiento) === "warning").length;
      setAlertas({ vencidos: venc, proximos: prox });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleVerFicha = async (id) => {
    const { data } = await getVehiculo(id);
    setFichaVehiculo(data);
    setModalFicha(true);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearVehiculo({ ...form, anio: parseInt(form.anio), kilometraje: parseInt(form.kilometraje) });
      setModalNuevo(false);
      setForm({ placa: "", marca: "", modelo: "", anio: new Date().getFullYear(), tipo: "Camión", kilometraje: 0, soatVencimiento: "", tecnomecanicaVencimiento: "", estado: "ACTIVO" });
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al crear vehículo");
    }
  };

  const estadoMap = { ACTIVO: "success", EN_MANTENIMIENTO: "warning", FUERA_DE_SERVICIO: "danger" };

  const vehiculoColumns = [
    {
      key: "placa", title: "Placa",
      render: (v, row) => (
        <button onClick={() => handleVerFicha(row.id)} className="font-semibold mono text-sm hover:underline" style={{ color: "var(--accent)" }}>
          {v}
        </button>
      ),
    },
    { key: "tipo", title: "Tipo" },
    {
      key: "marca", title: "Marca / Modelo",
      render: (v, row) => <span className="text-sm">{v} {row.modelo}</span>,
    },
    { key: "anio", title: "Año", render: (v) => <span className="mono">{v}</span> },
    { key: "kilometraje", title: "Km", render: (v) => <span className="mono text-xs">{fmtKm(v)}</span> },
    {
      key: "soatVencimiento", title: "SOAT",
      render: (v) => {
        const alerta = getAlertaStatus(v);
        return (
          <div>
            <div className="text-xs">{fmtFecha(v)}</div>
            {alerta && <StatusBadge status={alerta} label={alerta === "danger" ? "Vencido" : "Próximo"} />}
          </div>
        );
      },
    },
    {
      key: "tecnomecanicaVencimiento", title: "Tec-Mec",
      render: (v) => {
        const alerta = getAlertaStatus(v);
        return (
          <div>
            <div className="text-xs">{fmtFecha(v)}</div>
            {alerta && <StatusBadge status={alerta} label={alerta === "danger" ? "Vencido" : "Próximo"} />}
          </div>
        );
      },
    },
    {
      key: "estado", title: "Estado",
      render: (v) => <StatusBadge status={estadoMap[v] || "neutral"} label={v?.replace("_", " ")} />,
    },
    {
      key: "conductores", title: "Conductor",
      render: (v) => {
        const activo = v?.find(vc => vc.activo);
        return activo ? <span className="text-xs">{activo.conductor?.usuario?.nombre}</span> : <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Flota Vehicular"
        subtitle={`${vehiculos.length} vehículos registrados · Paso 11 Resolución 40595`}
        actions={
          <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <Plus size={15} /> Nuevo vehículo
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Alertas banner */}
        {(alertas.vencidos > 0 || alertas.proximos > 0) && (
          <div className="flex flex-wrap gap-3 mb-4">
            {alertas.vencidos > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)" }}>
                <AlertTriangle size={14} />
                {alertas.vencidos} vehículo{alertas.vencidos > 1 ? "s" : ""} con documentos vencidos
              </div>
            )}
            {alertas.proximos > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
                <AlertTriangle size={14} />
                {alertas.proximos} próximo{alertas.proximos > 1 ? "s" : ""} a vencer (≤30 días)
              </div>
            )}
          </div>
        )}

        <DataTable
          columns={vehiculoColumns}
          data={vehiculos}
          loading={loading}
          emptyTitle="Sin vehículos registrados"
          emptySubtitle="Agrega los vehículos de la flota de TransCor S.A.S."
        />
      </div>

      {/* Modal ficha vehículo */}
      <Modal open={modalFicha} onClose={() => setModalFicha(false)} title={`Ficha — ${fichaVehiculo?.placa || ""}`} size="lg">
        {fichaVehiculo && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ["Placa", fichaVehiculo.placa],
                ["Marca", fichaVehiculo.marca],
                ["Modelo", fichaVehiculo.modelo],
                ["Año", fichaVehiculo.anio],
                ["Tipo", fichaVehiculo.tipo],
                ["Kilometraje", fmtKm(fichaVehiculo.kilometraje)],
                ["SOAT vence", fmtFecha(fichaVehiculo.soatVencimiento)],
                ["Tec-Mec vence", fmtFecha(fichaVehiculo.tecnomecanicaVencimiento)],
                ["Estado", fichaVehiculo.estado],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
                  <div className="text-sm" style={{ color: "var(--text-primary)" }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Inspecciones */}
            {fichaVehiculo.inspecciones?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Inspecciones recientes</h4>
                <div className="space-y-2">
                  {fichaVehiculo.inspecciones.slice(0, 5).map((ins) => (
                    <div key={ins.id} className="p-3 rounded-lg border text-sm" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between">
                        <span className="font-medium">{ins.tipo} — {ins.resultado}</span>
                        <span className="mono text-xs" style={{ color: "var(--text-muted)" }}>{fmtFecha(ins.fecha)}</span>
                      </div>
                      {ins.observaciones && <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{ins.observaciones}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fichaVehiculo.mantenimientos?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Historial de mantenimientos</h4>
                <div className="space-y-2">
                  {fichaVehiculo.mantenimientos.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg border text-sm" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between">
                        <span className="font-medium">{m.tipo} — {m.descripcion}</span>
                        <span className="mono text-xs" style={{ color: "var(--text-muted)" }}>{fmtFecha(m.fecha)}</span>
                      </div>
                      {m.taller && <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Taller: {m.taller}</div>}
                      {m.costo && <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Costo: ${m.costo.toLocaleString("es-CO")}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal nuevo vehículo */}
      <Modal
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        title="Registrar vehículo"
        size="md"
        footer={
          <>
            <button onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancelar</button>
            <button onClick={handleCrear} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>Guardar</button>
          </>
        }
      >
        <form onSubmit={handleCrear} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Placa</label>
              <input value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })} required placeholder="ABC-123" className="w-full px-3 py-2 rounded-lg border text-sm mono uppercase" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                {["Camión", "Camioneta", "Bus", "Buseta", "Microbús"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Marca</label>
              <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Modelo</label>
              <input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Año</label>
              <input type="number" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} min={2000} max={2030} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Kilometraje</label>
              <input type="number" value={form.kilometraje} onChange={(e) => setForm({ ...form, kilometraje: e.target.value })} min={0} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vence SOAT</label>
              <input type="date" value={form.soatVencimiento} onChange={(e) => setForm({ ...form, soatVencimiento: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vence Tec-Mec</label>
              <input type="date" value={form.tecnomecanicaVencimiento} onChange={(e) => setForm({ ...form, tecnomecanicaVencimiento: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
