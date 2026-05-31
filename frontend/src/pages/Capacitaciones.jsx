import { useState, useEffect, useCallback } from "react";
import { Clock, Users, CheckCircle, Award, ChevronDown, Plus, UserPlus } from "lucide-react";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { getCapacitaciones, getParticipantes, eliminarCapacitacion, getAsistencia, registrarAsistencia } from "../services/capacitaciones.service";
import CrearCapacitacion from "../components/capacitaciones/CrearCapacitacion";
import InscribirUsuarios from "../components/capacitaciones/InscribirUsuarios";
import MisCapacitaciones from "../components/capacitaciones/MisCapacitaciones";
import RealizarCapacitacion from "../components/capacitaciones/RealizarCapacitacion";
import VerCertificado from "../components/capacitaciones/VerCertificado";
import useAuthStore from "../store/authStore";
import { useRole } from "../hooks/useRole";

const fmtFecha = (d) => d ? new Date(d).toLocaleDateString("es-CO") : "—";
const estadoParticipante = (p) => {
  if (p.aprobado) return "completado";
  if (p.completadoEn) return "reprobado";
  return "pendiente";
};
const estadoColors = {
  completado: { bg: "var(--success-bg)", text: "var(--success)", label: "Completado" },
  reprobado: { bg: "var(--danger-bg)", text: "var(--danger)", label: "Reprobado" },
  pendiente: { bg: "#F3F4F6", text: "#6B7280", label: "Pendiente" },
};

export default function Capacitaciones() {
  const user = useAuthStore((s) => s.user);
  const { isAdmin: isAdminFn, isGerente: isGerenteFn, isLider: isLiderFn } = useRole();
  const isAdmin = isAdminFn();
  const isGerente = isGerenteFn();
  const canManage = isAdmin || isGerente || isLiderFn();
  const [vista, setVista] = useState(canManage ? "admin" : "mis");
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionada, setSeleccionada] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [loadingPart, setLoadingPart] = useState(false);
  const [modalPart, setModalPart] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalInscribir, setModalInscribir] = useState(false);
  const [modalRealizar, setModalRealizar] = useState(false);
  const [modalCertificado, setModalCertificado] = useState(false);
  const [usuarioCapacitacionSeleccionada, setUsuarioCapacitacionSeleccionada] = useState(null);
  const [misCapKey, setMisCapKey] = useState(0);
  const [modalAsistencia, setModalAsistencia] = useState(false);
  const [asistencia, setAsistencia] = useState([]);
  const [loadingAsist, setLoadingAsist] = useState(false);
  const [registrandoAsist, setRegistrandoAsist] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCapacitaciones();
      setCapacitaciones(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleVerParticipantes = async (cap) => {
    setSeleccionada(cap);
    setLoadingPart(true);
    setModalPart(true);
    try {
      const { data } = await getParticipantes(cap.id);
      setParticipantes(data);
    } finally {
      setLoadingPart(false);
    }
  };

  const handleRealizarCapacitacion = (uc) => {
    setUsuarioCapacitacionSeleccionada(uc);
    setModalRealizar(true);
  };

  const handleCompletadoCapacitacion = () => {
    if (vista === "mis") {
      setMisCapKey(prev => prev + 1);
    } else {
      cargar();
    }
  };

  const handleVerCertificado = (uc) => {
    setUsuarioCapacitacionSeleccionada(uc);
    setModalCertificado(true);
  };

  const handleVerAsistencia = async (cap) => {
    setSeleccionada(cap);
    setLoadingAsist(true);
    setModalAsistencia(true);
    try {
      const { data } = await getAsistencia(cap.id);
      setAsistencia(data);
    } finally {
      setLoadingAsist(false);
    }
  };

  const handleRegistrarAsistencia = async (usuarioId, asistio) => {
    if (!seleccionada) return;
    setRegistrandoAsist(true);
    try {
      const { data } = await registrarAsistencia(seleccionada.id, { usuarioId, asistio });
      setAsistencia((prev) => [data, ...prev]);
    } catch {
      alert("Error al registrar asistencia");
    } finally {
      setRegistrandoAsist(false);
    }
  };

  const handleEliminarCapacitacion = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta capacitación?")) {
      try {
        await eliminarCapacitacion(id);
        cargar();
      } catch (err) {
        console.error("Error al eliminar capacitación:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Capacitaciones PESV" subtitle="Programa de formación continua — Pasos 15-18 Resolución 40595" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Tabs de navegación */}
        {canManage && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setVista("admin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                vista === "admin"
                  ? "text-white"
                  : "border"
              }`}
              style={
                vista === "admin"
                  ? { backgroundColor: "#1B6CA8" }
                  : { borderColor: "#D1D5DB", backgroundColor: "#F3F4F6", color: "#374151" }
              }
            >
              Gestión de Capacitaciones
            </button>
            <button
              onClick={() => setVista("mis")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                vista === "mis"
                  ? "text-white"
                  : "border"
              }`}
              style={
                vista === "mis"
                  ? { backgroundColor: "#1B6CA8" }
                  : { borderColor: "#D1D5DB", backgroundColor: "#F3F4F6", color: "#374151" }
              }
            >
              Mis Capacitaciones
            </button>
          </div>
        )}

        {/* Vista de Mis Capacitaciones */}
        {vista === "mis" ? (
          <MisCapacitaciones
            key={misCapKey}
            onRealizarCapacitacion={handleRealizarCapacitacion}
            onVerCertificado={handleVerCertificado}
          />
        ) : (
          <>
            {/* Botones de acción para admin y gerente */}
            {isAdmin && (
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setModalCrear(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "#1B6CA8" }}
                >
                  <Plus size={16} />
                  Crear Capacitación
                </button>
                <button
                  onClick={() => setModalInscribir(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
                  style={{ 
                    borderColor: "#D1D5DB", 
                    backgroundColor: "#F3F4F6",
                    color: "#374151"
                  }}
                >
                  <UserPlus size={16} />
                  Inscribir Usuarios
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 pulse" style={{ boxShadow: "var(--shadow)" }}>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {capacitaciones.map((cap) => {
                  const pct = cap.totalParticipantes > 0 ? Math.round((cap.completados / cap.totalParticipantes) * 100) : 0;
                  return (
                    <div key={cap.id} className="bg-white rounded-xl p-5 flex flex-col" style={{ boxShadow: "var(--shadow)" }}>
                      {/* Header card */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{cap.titulo}</h3>
                          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>{cap.descripcion}</p>
                        </div>
                        {cap.obligatoria && (
                          <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}>
                            Obligatorio
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Clock size={12} />
                          {cap.duracion} min
                        </div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Users size={12} />
                          {cap.totalParticipantes} inscritos
                        </div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--success)" }}>
                          <CheckCircle size={12} />
                          {cap.completados} aprobados
                        </div>
                      </div>

                      {/* Progreso */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: "var(--text-muted)" }}>Progreso general</span>
                          <span className="font-medium mono" style={{ color: "var(--text-primary)" }}>{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F3F4F6" }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? "#166534" : pct >= 50 ? "#92400E" : "#1B6CA8" }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-auto flex-wrap">
                        <button
                          onClick={() => handleVerParticipantes(cap)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                        >
                          <Users size={14} />
                          Participantes
                        </button>
                        <button
                          onClick={() => handleVerAsistencia(cap)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-blue-50"
                          style={{ borderColor: "#93C5FD", color: "#1B6CA8" }}
                        >
                          <CheckCircle size={14} />
                          Asistencia
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleEliminarCapacitacion(cap.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal participantes */}
      <Modal
        open={modalPart}
        onClose={() => setModalPart(false)}
        title={`Participantes — ${seleccionada?.titulo || ""}`}
        size="lg"
      >
        {loadingPart ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded pulse" />)}
          </div>
        ) : participantes.length === 0 ? (
          <div className="text-center py-10 text-sm" style={{ color: "var(--text-muted)" }}>
            Sin participantes inscritos aún
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--bg-input)" }}>
                <tr>
                  {["Conductor", "Estado", "Puntaje", "Completado", "Certificado"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participantes.map((p) => {
                  const est = estadoParticipante(p);
                  const c = estadoColors[est];
                  return (
                    <tr key={p.id} className="border-t" style={{ borderColor: "#F3F4F6" }}>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{p.usuario.nombre}</div>
                        {p.conductor && <div className="text-xs" style={{ color: "var(--text-muted)" }}>CC {p.conductor.cedula}</div>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: c.bg, color: c.text }}>{c.label}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="mono font-semibold" style={{ color: p.puntaje >= 70 ? "var(--success)" : p.puntaje ? "var(--danger)" : "var(--text-muted)" }}>
                          {p.puntaje != null ? `${p.puntaje}%` : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs" style={{ color: "var(--text-muted)" }}>{fmtFecha(p.completadoEn)}</td>
                      <td className="px-3 py-2.5">
                        {p.aprobado ? (
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--success)" }}>
                            <Award size={13} />
                            Emitido
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Modal crear capacitación */}
      <CrearCapacitacion
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        onSuccess={() => {
          cargar();
          setModalCrear(false);
        }}
      />

      {/* Modal inscribir usuarios */}
      <InscribirUsuarios
        open={modalInscribir}
        onClose={() => setModalInscribir(false)}
        capacitacion={null}
        onSuccess={() => {
          cargar();
          setModalInscribir(false);
        }}
      />

      {/* Modal realizar capacitación */}
      <RealizarCapacitacion
        open={modalRealizar}
        onClose={() => setModalRealizar(false)}
        usuarioCapacitacion={usuarioCapacitacionSeleccionada}
        onCompletado={handleCompletadoCapacitacion}
      />

      {/* Modal ver certificado */}
      <VerCertificado
        open={modalCertificado}
        onClose={() => setModalCertificado(false)}
        usuarioCapacitacion={usuarioCapacitacionSeleccionada}
      />

      {/* Modal control de asistencia */}
      <Modal
        open={modalAsistencia}
        onClose={() => setModalAsistencia(false)}
        title={`Asistencia — ${seleccionada?.titulo || ""}`}
        size="lg"
      >
        <div className="space-y-4">
          {canManage && (
            <div className="p-3 rounded-lg border" style={{ borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Registrar nueva asistencia</p>
              <div className="flex gap-2">
                <input
                  id="asist-usuario-id"
                  placeholder="ID de usuario"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border"
                  style={{ borderColor: "#D1D5DB" }}
                />
                <button
                  disabled={registrandoAsist}
                  onClick={() => {
                    const uid = document.getElementById("asist-usuario-id").value.trim();
                    if (uid) handleRegistrarAsistencia(uid, true);
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: "#166534" }}
                >
                  Asistió
                </button>
                <button
                  disabled={registrandoAsist}
                  onClick={() => {
                    const uid = document.getElementById("asist-usuario-id").value.trim();
                    if (uid) handleRegistrarAsistencia(uid, false);
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium border"
                  style={{ borderColor: "#991B1B", color: "#991B1B" }}
                >
                  No asistió
                </button>
              </div>
            </div>
          )}

          {loadingAsist ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded pulse" />)}</div>
          ) : asistencia.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
              Sin registros de asistencia para esta capacitación
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: "var(--bg-input)" }}>
                  <tr>
                    {["Participante", "Fecha", "Estado", "Observaciones"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {asistencia.map((a) => (
                    <tr key={a.id} className="border-t" style={{ borderColor: "#F3F4F6" }}>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{a.usuario.nombre}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{a.usuario.email}</div>
                      </td>
                      <td className="px-3 py-2.5 text-xs" style={{ color: "var(--text-muted)" }}>{fmtFecha(a.fecha)}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ backgroundColor: a.asistio ? "var(--success-bg)" : "var(--danger-bg)", color: a.asistio ? "var(--success)" : "var(--danger)" }}>
                          {a.asistio ? "Asistió" : "No asistió"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs" style={{ color: "var(--text-muted)" }}>{a.observaciones || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
