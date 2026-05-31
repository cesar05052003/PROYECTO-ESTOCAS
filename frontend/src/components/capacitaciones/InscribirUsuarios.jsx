import { useState, useEffect } from "react";
import { UserPlus, X, Search, Check } from "lucide-react";
import Modal from "../ui/Modal";
import { getUsuarios } from "../../services/usuarios.service";
import { inscribir, getCapacitaciones } from "../../services/capacitaciones.service";

export default function InscribirUsuarios({ open, onClose, capacitacion: capacitacionProp, onSuccess }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [error, setError] = useState("");
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [capacitacionSeleccionada, setCapacitacionSeleccionada] = useState(null);

  useEffect(() => {
    if (open) {
      cargarUsuarios();
      cargarCapacitaciones();
      if (capacitacionProp) {
        setCapacitacionSeleccionada(capacitacionProp);
      }
    } else {
      // Limpiar estados al cerrar
      setUsuariosSeleccionados([]);
      setCapacitacionSeleccionada(null);
      setError("");
    }
  }, [open, capacitacionProp]);

  const cargarCapacitaciones = async () => {
    try {
      const { data } = await getCapacitaciones();
      setCapacitaciones(data);
      if (!capacitacionProp && data.length > 0) {
        setCapacitacionSeleccionada(data[0]);
      }
    } catch (err) {
      console.error("Error al cargar capacitaciones:", err);
    }
  };

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await getUsuarios();
      setUsuarios(data.filter((u) => u.activo));
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleSeleccion = (usuario) => {
    console.log("toggleSeleccion llamado para:", usuario.nombre);
    setUsuariosSeleccionados((prev) => {
      const existe = prev.find((u) => u.id === usuario.id);
      console.log("Usuario existe en seleccionados:", existe);
      if (existe) {
        return prev.filter((u) => u.id !== usuario.id);
      }
      return [...prev, usuario];
    });
  };

  const handleInscribir = async () => {
    console.log("handleInscribir llamado", { capacitacionSeleccionada, usuariosSeleccionados });
    if (!capacitacionSeleccionada) {
      setError("Seleccione una capacitación");
      return;
    }
    if (usuariosSeleccionados.length === 0) {
      setError("Seleccione al menos un usuario");
      return;
    }

    setInscribiendo(true);
    setError("");

    try {
      for (const usuario of usuariosSeleccionados) {
        console.log("Inscribiendo usuario:", usuario.id, "en capacitación:", capacitacionSeleccionada.id);
        await inscribir(capacitacionSeleccionada.id, { usuarioId: usuario.id });
      }
      onSuccess();
      onClose();
      setUsuariosSeleccionados([]);
      setCapacitacionSeleccionada(null);
    } catch (err) {
      console.error("Error al inscribir:", err);
      setError("Error al inscribir usuarios. Algunos usuarios ya pueden estar inscritos.");
    } finally {
      setInscribiendo(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Inscribir Usuarios - ${capacitacionSeleccionada?.titulo || "Selecciona una capacitación"}`} size="lg">
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)" }}>
            {error}
          </div>
        )}

        {/* Selector de capacitación */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
            Seleccionar Capacitación
          </label>
          <select
            value={capacitacionSeleccionada?.id || ""}
            onChange={(e) => {
              const selected = capacitaciones.find((c) => c.id === e.target.value);
              setCapacitacionSeleccionada(selected || null);
            }}
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#D1D5DB", color: "#374151" }}
          >
            {capacitaciones.map((cap) => (
              <option key={cap.id} value={cap.id}>
                {cap.titulo} ({cap.duracion} min)
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#D1D5DB", color: "#374151" }}
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded pulse" />
            ))}
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
            No se encontraron usuarios
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {usuariosFiltrados.map((usuario) => {
              const seleccionado = usuariosSeleccionados.find((u) => u.id === usuario.id);
              return (
                <div
                  key={usuario.id}
                  onClick={() => toggleSeleccion(usuario)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    seleccionado ? "border-2" : "border"
                  }`}
                  style={{
                    borderColor: seleccionado ? "var(--primary)" : "var(--border)",
                    backgroundColor: seleccionado ? "var(--primary-bg)" : "var(--bg-secondary)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                        {usuario.nombre}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {usuario.email}
                      </div>
                      <div className="text-xs mt-1">
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "var(--info-bg)",
                            color: "var(--info)",
                          }}
                        >
                          {usuario.rol}
                        </span>
                      </div>
                    </div>
                    {seleccionado && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: "var(--primary)" }}>
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            {usuariosSeleccionados.length} usuario{usuariosSeleccionados.length !== 1 ? "s" : ""} seleccionado
            {usuariosSeleccionados.length !== 1 ? "s" : ""}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ 
                borderColor: "#D1D5DB", 
                backgroundColor: "#F3F4F6",
                color: "#374151"
              }}
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              onClick={() => {
                console.log("Botón clickeado", { inscribiendo, usuariosSeleccionadosLength: usuariosSeleccionados.length });
                handleInscribir();
              }}
              disabled={inscribiendo || usuariosSeleccionados.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{
                backgroundColor: usuariosSeleccionados.length === 0 ? "#6B7280" : "#1B6CA8",
                opacity: usuariosSeleccionados.length === 0 ? 0.7 : 1,
                cursor: usuariosSeleccionados.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              <UserPlus size={16} />
              {inscribiendo ? "Inscribiendo..." : usuariosSeleccionados.length === 0 ? "Seleccione usuarios" : "Inscribir Usuarios"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
