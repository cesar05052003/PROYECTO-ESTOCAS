import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import Modal from "../ui/Modal";
import { crearCapacitacion, agregarPregunta } from "../../services/capacitaciones.service";

export default function CrearCapacitacion({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    duracion: "",
    categoria: "",
    obligatoria: true,
  });
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    enunciado: "",
    opciones: ["", "", "", ""],
    respuestaCorrecta: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpcionChange = (index, value) => {
    setNuevaPregunta((prev) => ({
      ...prev,
      opciones: prev.opciones.map((op, i) => (i === index ? value : op)),
    }));
  };

  const agregarPreguntaLista = () => {
    console.log("agregarPreguntaLista - llamada");
    console.log("agregarPreguntaLista - nuevaPregunta:", nuevaPregunta);
    
    if (!nuevaPregunta.enunciado.trim()) {
      setError("El enunciado de la pregunta es requerido");
      return;
    }
    
    // Validar que al menos 2 opciones estén llenas
    const opcionesLlenas = nuevaPregunta.opciones.filter(op => op.trim());
    if (opcionesLlenas.length < 2) {
      setError("Debes ingresar al menos 2 opciones de respuesta");
      return;
    }

    setPreguntas((prev) => {
      const nuevas = [...prev, { ...nuevaPregunta }];
      console.log("agregarPreguntaLista - preguntas después de agregar:", nuevas);
      return nuevas;
    });
    setNuevaPregunta({
      enunciado: "",
      opciones: ["", "", "", ""],
      respuestaCorrecta: 0,
    });
    setError("");
  };

  const eliminarPregunta = (index) => {
    setPreguntas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("CrearCapacitacion - INICIANDO CREACIÓN");
      console.log("CrearCapacitacion - formData:", formData);
      console.log("CrearCapacitacion - preguntas state:", preguntas);
      
      // Validar que se hayan agregado preguntas
      if (preguntas.length === 0) {
        console.error("CrearCapacitacion - ERROR: No hay preguntas agregadas a la lista");
        setError("Debes agregar al menos una pregunta haciendo clic en 'Agregar pregunta' antes de crear la capacitación");
        setLoading(false);
        return;
      }
      
      const capacitacion = await crearCapacitacion(formData);
      console.log("CrearCapacitacion - respuesta completa:", capacitacion);
      console.log("CrearCapacitacion - capacitacion.data:", capacitacion.data);
      
      if (!capacitacion.data || !capacitacion.data.id) {
        console.error("CrearCapacitacion - ERROR: No se obtuvo el ID de la capacitación");
        setError("Error al crear la capacitación: No se obtuvo el ID");
        return;
      }
      
      const capId = capacitacion.data.id;
      console.log("CrearCapacitacion - capId:", capId);
      console.log("CrearCapacitacion - número de preguntas a agregar:", preguntas.length);

      for (let i = 0; i < preguntas.length; i++) {
        const pregunta = preguntas[i];
        console.log(`CrearCapacitacion - agregando pregunta ${i + 1}/${preguntas.length}:`, pregunta);
        try {
          const resultado = await agregarPregunta({
            capacitacionId: capId,
            enunciado: pregunta.enunciado,
            opciones: pregunta.opciones,
            respuestaCorrecta: pregunta.respuestaCorrecta,
          });
          console.log(`CrearCapacitacion - pregunta ${i + 1} agregada:`, resultado);
        } catch (errPregunta) {
          console.error(`CrearCapacitacion - ERROR al agregar pregunta ${i + 1}:`, errPregunta);
          throw errPregunta;
        }
      }

      console.log("CrearCapacitacion - CREACIÓN COMPLETADA CON ÉXITO");
      onSuccess();
      onClose();
      setFormData({
        titulo: "",
        descripcion: "",
        contenido: "",
        duracion: "",
        categoria: "",
        obligatoria: true,
      });
      setPreguntas([]);
    } catch (err) {
      console.error("CrearCapacitacion - error:", err);
      setError("Error al crear la capacitación. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Crear Nueva Capacitación" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)" }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              placeholder="Ej: Seguridad Vial Básica"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <option value="">Seleccionar...</option>
              <option value="SEGURIDAD_VIAL">Seguridad Vial</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="NORMAS">Normas y Regulaciones</option>
              <option value="PRIMEROS_AUXILIOS">Primeros Auxilios</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Duración (minutos) *
            </label>
            <input
              type="number"
              name="duracion"
              value={formData.duracion}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
              placeholder="Ej: 30"
            />
          </div>

          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="obligatoria"
                checked={formData.obligatoria}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Capacitación obligatoria
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Descripción *
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            rows={2}
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            placeholder="Breve descripción de la capacitación"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Contenido *
          </label>
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            placeholder="Contenido detallado de la capacitación"
          />
        </div>

        <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Preguntas de Evaluación
          </h3>

          <div className="space-y-4 mb-4">
            {preguntas.map((pregunta, index) => (
              <div key={index} className="p-4 rounded-lg border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                    {index + 1}. {pregunta.enunciado}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarPregunta(index)}
                    className="p-1 rounded hover:bg-red-100"
                    style={{ color: "var(--danger)" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-xs space-y-1" style={{ color: "var(--text-muted)" }}>
                  {pregunta.opciones.map((op, i) => (
                    <div key={i} className={i === pregunta.respuestaCorrecta ? "font-semibold" : ""}>
                      {i === pregunta.respuestaCorrecta ? "✓ " : ""}{i + 1}. {op}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Enunciado de la pregunta
              </label>
              <input
                type="text"
                value={nuevaPregunta.enunciado}
                onChange={(e) => setNuevaPregunta((prev) => ({ ...prev, enunciado: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                placeholder="Ej: ¿Cuál es la velocidad máxima en zona urbana?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Opciones de respuesta
              </label>
              {nuevaPregunta.opciones.map((opcion, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="respuestaCorrecta"
                    checked={nuevaPregunta.respuestaCorrecta === index}
                    onChange={() => setNuevaPregunta((prev) => ({ ...prev, respuestaCorrecta: index }))}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={opcion}
                    onChange={(e) => handleOpcionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                    placeholder={`Opción ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={agregarPreguntaLista}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}
            >
              <Plus size={16} />
              Agregar pregunta
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#1B6CA8" }}
          >
            <Save size={16} />
            {loading ? "Guardando..." : "Crear Capacitación"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
