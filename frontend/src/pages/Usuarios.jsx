import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, User, Shield, Users as UsersIcon } from "lucide-react";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../services/usuarios.service";
import { getConductores } from "../services/conductores.service";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO");

const rolLabels = {
  ADMINISTRADOR: "Administrador",
  GERENTE: "Gerente",
  LIDER: "Lider PESV",
  CONDUCTOR: "Conductor",
};

const rolColors = {
  ADMINISTRADOR: { bg: "var(--danger-bg)", text: "var(--danger)" },
  GERENTE: { bg: "var(--warning-bg)", text: "var(--warning)" },
  LIDER: { bg: "var(--info-bg)", text: "var(--info)" },
  CONDUCTOR: { bg: "var(--success-bg)", text: "var(--success)" },
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "CONDUCTOR", activo: true });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [usuariosRes, conductoresRes] = await Promise.all([
        getUsuarios(),
        getConductores(),
      ]);
      const usuariosData = Array.isArray(usuariosRes.data) ? usuariosRes.data : usuariosRes.data?.data || [];
      const conductoresData = Array.isArray(conductoresRes.data) ? conductoresRes.data : conductoresRes.data?.data || [];
      
      // Combinar usuarios con sus datos de conductor
      const usuariosConConductor = usuariosData.map(usuario => {
        const conductor = conductoresData.find(c => c.usuarioId === usuario.id);
        return { ...usuario, conductor };
      });
      
      setUsuarios(usuariosConConductor);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearUsuario(form);
      setModalCrear(false);
      setForm({ nombre: "", email: "", password: "", rol: "CONDUCTOR", activo: true });
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al crear usuario");
    }
  };

  const handleEditar = (usuario) => {
    setSelected(usuario);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setModalEditar(true);
  };

  const handleGuardarEditar = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...form };
      if (!dataToUpdate.password) delete dataToUpdate.password;
      await actualizarUsuario(selected.id, dataToUpdate);
      setModalEditar(false);
      setSelected(null);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al actualizar usuario");
    }
  };

  const handleEliminar = (usuario) => {
    setSelected(usuario);
    setModalEliminar(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      await eliminarUsuario(selected.id);
      setModalEliminar(false);
      setSelected(null);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar usuario");
    }
  };

  // Cálculos para tarjetas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.activo).length;
  const adminsLideres = usuarios.filter((u) => u.rol === "ADMINISTRADOR" || u.rol === "LIDER").length;
  const numConductores = usuarios.filter((u) => u.rol === "CONDUCTOR").length;

  const columns = [
    {
      key: "usuario",
      title: "USUARIO",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {row.nombre?.charAt(0) || "?"}
          </div>
          <div>
            <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{row.nombre}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "rol",
      title: "ROL",
      render: (v) => {
        const colors = rolColors[v] || rolColors.CONDUCTOR;
        return (
          <span
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {rolLabels[v] || v}
          </span>
        );
      },
    },
    {
      key: "cedula",
      title: "CÉDULA",
      render: (_, row) => {
        const cedula = row.conductor?.cedula || "-";
        return <span className="text-sm mono">{cedula}</span>;
      },
    },
    {
      key: "estado",
      title: "ESTADO",
      render: (v) => <StatusBadge status={v ? "success" : "neutral"} label={v ? "Activo" : "Inactivo"} />,
    },
    {
      key: "creado",
      title: "CREADO",
      render: (v) => <div className="text-xs">{fmtFecha(v)}</div>,
    },
    {
      key: "acciones",
      title: "ACCIONES",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditar(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Pencil size={14} style={{ color: "var(--text-secondary)" }} />
          </button>
          <button
            onClick={() => handleEliminar(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={14} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Gestión de Usuarios"
        subtitle="Administración de accesos y roles del sistema PESV"
        actions={
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus size={16} />
            Nuevo usuario
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>TOTAL USUARIOS</span>
              <UsersIcon size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{totalUsuarios}</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>USUARIOS ACTIVOS</span>
              <User size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{usuariosActivos}</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>ADMINS / LÍDERES</span>
              <Shield size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{adminsLideres}</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>CONDUCTORES</span>
              <UsersIcon size={16} style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{numConductores}</div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <DataTable
          columns={columns}
          data={usuarios}
          loading={loading}
          emptyTitle="Sin usuarios registrados"
          emptySubtitle="No hay usuarios en el sistema"
        />
      </div>

      {/* Modal crear usuario */}
      <Modal
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        title="Nuevo usuario"
        size="md"
        footer={
          <>
            <button onClick={() => setModalCrear(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Cancelar
            </button>
            <button onClick={handleCrear} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>
              Crear usuario
            </button>
          </>
        }
      >
        <form onSubmit={handleCrear} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Rol</label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
            >
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="LIDER">Líder PESV</option>
              <option value="CONDUCTOR">Conductor</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal editar usuario */}
      <Modal
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        title={`Editar usuario — ${selected?.nombre || ""}`}
        size="md"
        footer={
          <>
            <button onClick={() => setModalEditar(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Cancelar
            </button>
            <button onClick={handleGuardarEditar} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>
              Guardar cambios
            </button>
          </>
        }
      >
        <form onSubmit={handleGuardarEditar} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Contraseña (dejar vacío para no cambiar)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Rol</label>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
            >
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="LIDER">Líder PESV</option>
              <option value="CONDUCTOR">Conductor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Estado</label>
            <select
              value={form.activo ? "true" : "false"}
              onChange={(e) => setForm({ ...form, activo: e.target.value === "true" })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal eliminar usuario */}
      <Modal
        open={modalEliminar}
        onClose={() => setModalEliminar(false)}
        title="Eliminar usuario"
        size="sm"
        footer={
          <>
            <button onClick={() => setModalEliminar(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Cancelar
            </button>
            <button onClick={handleConfirmarEliminar} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--danger)" }}>
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{selected?.nombre}</strong>? Esta acción desactivará el usuario.
        </p>
      </Modal>
    </div>
  );
}
