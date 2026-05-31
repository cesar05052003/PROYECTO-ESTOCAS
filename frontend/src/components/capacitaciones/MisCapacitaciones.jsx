import { useState, useEffect, useCallback } from "react";
import { Clock, PlayCircle, CheckCircle, XCircle, Award, Download } from "lucide-react";
import { getMisCapacitaciones } from "../../services/capacitaciones.service";

const fmtFecha = (d) => d ? new Date(d).toLocaleDateString("es-CO") : "—";

export default function MisCapacitaciones({ onRealizarCapacitacion, onVerCertificado }) {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMisCapacitaciones();
      setCapacitaciones(data);
    } catch (err) {
      console.error("Error al cargar capacitaciones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const estadoInfo = (uc) => {
    if (uc.aprobado) {
      return {
        icon: CheckCircle,
        color: "var(--success)",
        bg: "var(--success-bg)",
        label: "Aprobado",
      };
    }
    if (uc.completadoEn) {
      return {
        icon: XCircle,
        color: "var(--danger)",
        bg: "var(--danger-bg)",
        label: "Reprobado",
      };
    }
    return {
      icon: Clock,
      color: "var(--info)",
      bg: "var(--info-bg)",
      label: "Pendiente",
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Mis Capacitaciones
        </h2>
        <button
          onClick={cargar}
          className="text-sm px-3 py-1.5 rounded-lg border"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 pulse" style={{ boxShadow: "var(--shadow)" }}>
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="h-3 bg-gray-100 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : capacitaciones.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No tienes capacitaciones asignadas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capacitaciones.map((uc) => {
            const cap = uc.capacitacion;
            const estado = estadoInfo(uc);
            const EstadoIcon = estado.icon;
            
            return (
              <div key={uc.id} className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {cap.titulo}
                    </h3>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {cap.descripcion}
                    </p>
                  </div>
                  <span
                    className="ml-2 flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
                    style={{ backgroundColor: estado.bg, color: estado.color }}
                  >
                    <EstadoIcon size={12} />
                    {estado.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={12} />
                    {cap.duracion} min
                  </div>
                  {uc.puntaje !== null && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: uc.aprobado ? "var(--success)" : "var(--danger)" }}>
                      <span className="font-semibold">{uc.puntaje}%</span>
                    </div>
                  )}
                  {uc.intentos > 0 && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      Intentos: {uc.intentos}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!uc.completadoEn ? (
                    <button
                      onClick={() => onRealizarCapacitacion(uc)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      <PlayCircle size={14} />
                      Realizar
                    </button>
                  ) : !uc.aprobado ? (
                    <button
                      onClick={() => onRealizarCapacitacion(uc)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border"
                      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                    >
                      <PlayCircle size={14} />
                      Reintentar
                    </button>
                  ) : (
                    <button
                      onClick={() => onVerCertificado(uc)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}
                    >
                      <Award size={14} />
                      Ver Certificado
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
