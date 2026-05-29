import { useState, useEffect, useCallback } from "react";
import { Plus, User } from "lucide-react";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import { getConductores, crearConductor, actualizarConductor } from "../services/conductores.service";
import { getVehiculos } from "../services/vehiculos.service";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO");

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ cedula: "", telefono: "", licenciaCategoria: "B2", licenciaVencimiento: "", estado: "activo", vehiculoId: "" });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getConductores({ page });
      setConductores(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => {
    getVehiculos().then(({ data }) => setVehiculos(data.data || []));
  }, []);

  const handleEditar = (conductor) => {
    setSelected(conductor);
    setForm({
      cedula: conductor.cedula,
      telefono: conductor.telefono || "",
      licenciaCategoria: conductor.licenciaCategoria,
      licenciaVencimiento: conductor.licenciaVencimiento?.split("T")[0] || "",
      estado: conductor.estado,
      vehiculoId: conductor.vehiculoId || "",
    });
    setModalEditar(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await actualizarConductor(selected.id, form);
      setModalEditar(false);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar");
    }
  };

  const columns = [
    {
      key: "usuario", title: "Conductor",
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold flex-shrink-0" style={{ backgroundColor: "var(--accent)" }}>
            {v?.nombre?.charAt(0) || "?"}
          </div>
          <div>
            <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{v?.nombre}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>CC {row.cedula}</div>
          </div>
        </div>
      ),
    },
    { key: "licenciaCategoria", title: "Categoría", render: (v) => <span className="mono font-semibold px-2 py-1 rounded" style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}>{v}</span> },
    {
      key: "licenciaVencimiento", title: "Vence licencia",
      render: (v, row) => (
        <div>
          <div className="text-xs">{fmtFecha(v)}</div>
          {row.alertaLicencia && <StatusBadge status={row.alertaLicencia} size="xs" />}
        </div>
      ),
    },
    { key: "estado", title: "Estado", render: (v) => <StatusBadge status={v} /> },
    {
      key: "vehiculo", title: "Vehículo",
      render: (v) => v ? <span className="mono text-sm font-medium">{v.placa}</span> : <span style={{ color: "var(--text-muted)" }}>Sin asignar</span>,
    },
    {
      key: "_count", title: "Incidentes",
      render: (v) => <span className="mono">{v?.incidentes || 0}</span>,
    },
    {
      key: "acciones", title: "Acciones",
      render: (_, row) => (
        <button onClick={() => handleEditar(row)} className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Conductores"
        subtitle={`${total} conductores registrados · Paso 14 Resolución 40595`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <DataTable
          columns={columns}
          data={conductores}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={setPage}
          emptyTitle="Sin conductores registrados"
          emptySubtitle="Los conductores se crean al registrar usuarios con rol CONDUCTOR"
        />
      </div>

      {/* Modal editar conductor */}
      <Modal
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        title={`Editar conductor — ${selected?.usuario?.nombre || ""}`}
        size="md"
        footer={
          <>
            <button onClick={() => setModalEditar(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancelar</button>
            <button onClick={handleGuardar} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>Guardar cambios</button>
          </>
        }
      >
        <form onSubmit={handleGuardar} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Cédula</label>
              <input value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm mono" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Teléfono</label>
              <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Categoría licencia</label>
              <select value={form.licenciaCategoria} onChange={(e) => setForm({ ...form, licenciaCategoria: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                {["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vence licencia</label>
              <input type="date" value={form.licenciaVencimiento} onChange={(e) => setForm({ ...form, licenciaVencimiento: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Estado</label>
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="activo">Activo</option>
                <option value="suspendido">Suspendido</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vehículo asignado</label>
              <select value={form.vehiculoId} onChange={(e) => setForm({ ...form, vehiculoId: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="">Sin asignar</option>
                {vehiculos.map((v) => <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
