import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import Modal from "../ui/Modal";
import { getCapacitacionById, enviarRespuestas } from "../../services/capacitaciones.service";

export default function RealizarCapacitacion({ open, onClose, usuarioCapacitacion, onCompletado }) {
  const [capacitacion, setCapacitacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState("");
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (open && usuarioCapacitacion) {
      cargarCapacitacion();
      setPreguntaActual(0);
      setRespuestas({});
      setMostrarResultado(false);
      setResultado(null);
      setError("");
    }
  }, [open, usuarioCapacitacion]);

  const cargarCapacitacion = async () => {
    setLoading(true);
    try {
      const { data } = await getCapacitacionById(usuarioCapacitacion.capacitacionId);
      console.log("Capacitación cargada:", data);
      console.log("Preguntas:", data.preguntas);
      console.log("Número de preguntas:", data.preguntas?.length);
      setCapacitacion(data);
    } catch (err) {
      setError("Error al cargar la capacitación");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarRespuesta = (preguntaId, opcionIndex) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcionIndex,
    }));
  };

  const handleSiguiente = () => {
    if (preguntaActual < (capacitacion?.preguntas?.length || 0) - 1) {
      setPreguntaActual((prev) => prev + 1);
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const totalPreguntas = capacitacion?.preguntas?.length || 0;

    // Si no hay preguntas, marcar como completado automáticamente con 100%
    if (totalPreguntas === 0) {
      setEnviando(true);
      setError("");

      try {
        const response = await enviarRespuestas({
          usuarioCapacitacionId: usuarioCapacitacion.id,
          respuestas: {},
        });
        setResultado(response.data);
        setMostrarResultado(true);
        onCompletado();
      } catch (err) {
        setError("Error al completar la capacitación. Intente nuevamente.");
      } finally {
        setEnviando(false);
      }
      return;
    }

    const preguntasRespondidas = Object.keys(respuestas).length;

    if (preguntasRespondidas < totalPreguntas) {
      setError(`Debes responder todas las preguntas (${preguntasRespondidas}/${totalPreguntas})`);
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const response = await enviarRespuestas({
        usuarioCapacitacionId: usuarioCapacitacion.id,
        respuestas,
      });
      setResultado(response.data);
      setMostrarResultado(true);
      onCompletado();
    } catch (err) {
      setError("Error al enviar las respuestas. Intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <Modal open={open} onClose={onClose} title="Cargando Capacitación" size="lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--primary)" }} />
        </div>
      </Modal>
    );
  }

  if (mostrarResultado && resultado) {
    return (
      <Modal open={open} onClose={onClose} title="Resultado de la Evaluación" size="md">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            {resultado.aprobado ? (
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--success-bg)" }}>
                <CheckCircle size={40} style={{ color: "var(--success)" }} />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--danger-bg)" }}>
                <AlertCircle size={40} style={{ color: "var(--danger)" }} />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: resultado.aprobado ? "var(--success)" : "var(--danger)" }}>
              {resultado.aprobado ? "¡Felicitaciones!" : "No aprobado"}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {resultado.aprobado
                ? "Has completado satisfactoriamente la capacitación."
                : "No alcanzaste el puntaje mínimo de 70%. Puedes intentarlo nuevamente."}
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {resultado.puntaje}%
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              Puntaje obtenido
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              Cerrar
            </button>
            {!resultado.aprobado && (
              <button
                onClick={() => {
                  setMostrarResultado(false);
                  setPreguntaActual(0);
                  setRespuestas({});
                }}
                className="flex-1 py-3 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Intentar de nuevo
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  const pregunta = capacitacion?.preguntas?.[preguntaActual];
  const opciones = pregunta ? JSON.parse(pregunta.opciones) : [];
  const tienePreguntas = capacitacion?.preguntas?.length > 0;

  console.log("Estado del componente:", { tienePreguntas, numPreguntas: capacitacion?.preguntas?.length, preguntaActual, pregunta });

  return (
    <Modal open={open} onClose={onClose} title={capacitacion?.titulo || "Capacitación"} size="lg">
      <div className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)" }}>
            {error}
          </div>
        )}

        {!tienePreguntas ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <div className="flex items-center gap-2 mb-3" style={{ color: "var(--text-muted)" }}>
                <Clock size={16} />
                <span className="text-sm">{capacitacion?.duracion} minutos</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {capacitacion?.titulo}
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  {capacitacion?.descripcion}
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Contenido
                </h4>
                <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
                  {capacitacion?.contenido}
                </p>
              </div>

              <div className="p-4 rounded-lg border" style={{ borderColor: "#D1D5DB", backgroundColor: "#FEF3C7" }}>
                <p className="text-sm" style={{ color: "#92400E" }}>
                  Esta capacitación no tiene preguntas de evaluación. Al completarla, se marcará como aprobada automáticamente.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={handleSubmit}
                disabled={enviando}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: "#1B6CA8" }}
              >
                {enviando ? "Completando..." : "Completar Capacitación"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <div className="flex items-center gap-2 mb-3" style={{ color: "var(--text-muted)" }}>
                <Clock size={16} />
                <span className="text-sm">{capacitacion?.duracion} minutos</span>
                <span className="mx-2">•</span>
                <span className="text-sm">
                  Pregunta {preguntaActual + 1} de {capacitacion?.preguntas?.length || 0}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F3F4F6" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${((preguntaActual + 1) / (capacitacion?.preguntas?.length || 1)) * 100}%`,
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>
            </div>

            {pregunta && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    {pregunta.enunciado}
                  </h3>
                </div>

                <div className="space-y-3">
                  {opciones.map((opcion, index) => {
                    const seleccionado = respuestas[pregunta.id] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSeleccionarRespuesta(pregunta.id, index)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          seleccionado ? "border-2" : "border"
                        }`}
                        style={{
                          borderColor: seleccionado ? "var(--primary)" : "var(--border)",
                          backgroundColor: seleccionado ? "var(--primary-bg)" : "var(--bg-secondary)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              seleccionado ? "border-current" : ""
                            }`}
                            style={{
                              borderColor: seleccionado ? "var(--primary)" : "var(--border)",
                              backgroundColor: seleccionado ? "var(--primary)" : "transparent",
                            }}
                          >
                            {seleccionado && <CheckCircle size={14} className="text-white" />}
                          </div>
                          <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                            {opcion}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={handleAnterior}
                disabled={preguntaActual === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                {Object.keys(respuestas).length} de {capacitacion?.preguntas?.length || 0} respondidas
              </div>

              {preguntaActual === (capacitacion?.preguntas?.length || 0) - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={enviando}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "#1B6CA8" }}
                >
                  {enviando ? "Enviando..." : "Enviar respuestas"}
                </button>
              ) : (
                <button
                  onClick={handleSiguiente}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
