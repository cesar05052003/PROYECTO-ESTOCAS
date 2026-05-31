import { useState, useEffect, useCallback } from "react";
import { Plus, User, UserPlus } from "lucide-react";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import { getConductores, crearConductor, actualizarConductor } from "../services/conductores.service";
import { getVehiculos } from "../services/vehiculos.service";
import { getUsuarios } from "../services/usuarios.service";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO");

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuariosSinPerfil, setUsuariosSinPerfil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ cedula: "", telefono: "", licenciaCategoria: "B2", licenciaVencimiento: "", estado: "activo" });
  const [formCrear, setFormCrear] = useState({ usuarioId: "", cedula: "", telefono: "", licenciaCategoria: "B2", licenciaVencimiento: "", nivelEducacion: "", experienciaAnios: "" });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getConductores();
      setConductores(Array.isArray(data) ? data : data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => {
    Promise.all([
      getVehiculos(),
      getUsuarios(),
    ]).then(([vRes, uRes]) => {
      setVehiculos(Array.isArray(vRes.data) ? vRes.data : vRes.data?.data || []);
      const todosUsuarios = Array.isArray(uRes.data) ? uRes.data : uRes.data?.data || [];
      // Usuarios CONDUCTOR sin perfil de conductor aún (se actualizan en cargar())
      setUsuariosSinPerfil(todosUsuarios.filter((u) => u.rol === "CONDUCTOR"));
    });
  }, []);

  const handleEditar = (conductor) => {
    setSelected(conductor);
    setForm({
      cedula: conductor.cedula,
      telefono: conductor.telefono || "",
      licenciaCategoria: conductor.licenciaCategoria,
      licenciaVencimiento: conductor.licenciaVencimiento?.split("T")[0] || "",
      estado: conductor.estado,
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

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearConductor({
        ...formCrear,
        experienciaAnios: formCrear.experienciaAnios ? parseInt(formCrear.experienciaAnios) : undefined,
      });
      setModalCrear(false);
      setFormCrear({ usuarioId: "", cedula: "", telefono: "", licenciaCategoria: "B2", licenciaVencimiento: "", nivelEducacion: "", experienciaAnios: "" });
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al crear conductor");
    }
  };

  const conductoresIds = conductores.map((c) => c.usuarioId);
  const usuariosDisponibles = usuariosSinPerfil.filter((u) => !conductoresIds.includes(u.id));

  const getVehiculoAsignado = (conductor) => {
    const asignado = conductor.vehiculosAsignados?.find(va => va.activo);
    return asignado?.vehiculo || null;
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
      render: (v) => <div className="text-xs">{fmtFecha(v)}</div>,
    },
    { key: "estado", title: "Estado", render: (v) => <StatusBadge status={v === "activo" ? "success" : v === "suspendido" ? "warning" : "neutral"} label={v} /> },
    {
      key: "vehiculo", title: "Vehículo",
      render: (_, row) => {
        const vehiculo = getVehiculoAsignado(row);
        return vehiculo ? <span className="mono text-sm font-medium">{vehiculo.placa}</span> : <span style={{ color: "var(--text-muted)" }}>Sin asignar</span>;
      },
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
        subtitle={`${conductores.length} conductores registrados · Paso 14 Resolución 40595`}
        actions={
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus size={15} /> Nuevo Conductor
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <DataTable
          columns={columns}
          data={conductores}
          loading={loading}
          emptyTitle="Sin conductores registrados"
          emptySubtitle="Los conductores se crean al registrar usuarios con rol CONDUCTOR"
        />
      </div>

      {/* Modal crear conductor */}
      <Modal
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        title="Nuevo perfil de conductor"
        size="md"
        footer={
          <>
            <button onClick={() => setModalCrear(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancelar</button>
            <button onClick={handleCrear} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>Crear conductor</button>
          </>
        }
      >
        <form onSubmit={handleCrear} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Usuario (rol CONDUCTOR)</label>
            {usuariosDisponibles.length === 0 ? (
              <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: "var(--bg-input)", color: "var(--text-muted)" }}>
                No hay usuarios con rol CONDUCTOR sin perfil asignado. Crea uno primero en la sección Usuarios.
              </p>
            ) : (
              <select required value={formCrear.usuarioId} onChange={(e) => setFormCrear({ ...formCrear, usuarioId: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="">Seleccionar usuario...</option>
                {usuariosDisponibles.map((u) => <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>)}
              </select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Cédula</label>
              <input required value={formCrear.cedula} onChange={(e) => setFormCrear({ ...formCrear, cedula: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm mono" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Teléfono</label>
              <input value={formCrear.telefono} onChange={(e) => setFormCrear({ ...formCrear, telefono: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Categoría licencia</label>
              <select value={formCrear.licenciaCategoria} onChange={(e) => setFormCrear({ ...formCrear, licenciaCategoria: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                {["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Vence licencia</label>
              <input required type="date" value={formCrear.licenciaVencimiento} onChange={(e) => setFormCrear({ ...formCrear, licenciaVencimiento: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nivel educación</label>
              <select value={formCrear.nivelEducacion} onChange={(e) => setFormCrear({ ...formCrear, nivelEducacion: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="">Seleccionar...</option>
                {["Primaria", "Bachiller", "Técnico", "Tecnólogo", "Profesional"].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Años de experiencia</label>
              <input type="number" min={0} max={50} value={formCrear.experienciaAnios} onChange={(e) => setFormCrear({ ...formCrear, experienciaAnios: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
        </form>
      </Modal>

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
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Estado</label>
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
