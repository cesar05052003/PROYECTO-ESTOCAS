import { useState, useEffect, useCallback } from "react";
import { Clock, Users, CheckCircle, Award, ChevronDown } from "lucide-react";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { getCapacitaciones, getParticipantes } from "../services/capacitaciones.service";

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
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionada, setSeleccionada] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [loadingPart, setLoadingPart] = useState(false);
  const [modalPart, setModalPart] = useState(false);

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

  return (
    <div className="flex flex-col h-full">
      <Header title="Capacitaciones PESV" subtitle="Programa de formación continua — Pasos 15-18 Resolución 40595" />

      <div className="flex-1 overflow-y-auto p-6">
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

                  <button
                    onClick={() => handleVerParticipantes(cap)}
                    className="mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    <Users size={14} />
                    Ver participantes
                  </button>
                </div>
              );
            })}
          </div>
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
    </div>
  );
}
