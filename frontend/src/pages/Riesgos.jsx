import { useState, useEffect, useCallback } from "react";
import { Plus, Sparkles } from "lucide-react";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import ClaudeButton from "../components/ia/ClaudeButton";
import ClaudeOutputModal from "../components/ia/ClaudeOutputModal";
import { getRiesgos, getMatriz, crearRiesgo, actualizarRiesgo } from "../services/riesgos.service";
import { generarDocumento } from "../services/ia.service";
import { crearDocumento } from "../services/documentos.service";

const nivelColor = (n) => {
  if (n >= 15) return { bg: "var(--danger-bg)", text: "var(--danger)" };
  if (n >= 10) return { bg: "#FFEDD5", text: "#C2410C" };
  if (n >= 5)  return { bg: "var(--warning-bg)", text: "var(--warning)" };
  return { bg: "var(--success-bg)", text: "var(--success)" };
};

const categorias = ["HUMANO", "VEHICULAR", "INFRAESTRUCTURA", "ENTORNO", "GESTION"];

export default function Riesgos() {
  const [riesgos, setRiesgos] = useState([]);
  const [matriz, setMatriz] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [celda, setCelda] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaModal, setIaModal] = useState(false);
  const [iaContenido, setIaContenido] = useState("");
  const [savingDoc, setSavingDoc] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", categoria: "HUMANO", probabilidad: 3, impacto: 3, controlExistente: "", responsable: "" });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [r, m] = await Promise.all([getRiesgos(), getMatriz()]);
      const lista = Array.isArray(r.data) ? r.data : r.data.data || [];
      setRiesgos(lista);
      setTotal(lista.length);
      setMatriz(m.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleIA = async () => {
    setIaLoading(true);
    try {
      const criticos = riesgos.filter((r) => r.nivelRiesgo >= 12).map((r) => `- ${r.nombre} (P:${r.probabilidad} x I:${r.impacto} = ${r.nivelRiesgo}): ${r.descripcion}`).join("\n");
      const { data } = await generarDocumento("PROGRAMA_RIESGOS_CRITICOS", `Riesgos críticos identificados:\n${criticos}`);
      setIaContenido(data.contenido);
      setIaModal(true);
    } catch {
      alert("Error al generar con IA");
    } finally {
      setIaLoading(false);
    }
  };

  const handleGuardar = async () => {
    setSavingDoc(true);
    try {
      await crearDocumento({ titulo: "Programa de Gestión de Riesgos Críticos", categoria: "Programas", contenido: iaContenido, estado: "BORRADOR", generadoIA: true, pasoResolucion: 8 });
      setIaModal(false);
    } finally {
      setSavingDoc(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearRiesgo(form);
      setModalNuevo(false);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  const getCelda = (p, i) => matriz.find((c) => c.probabilidad === p && c.impacto === i);

  const columns = [
    { key: "nombre", title: "Riesgo", render: (v, row) => <div><div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{v}</div><div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{row.categoria}</div></div> },
    { key: "probabilidad", title: "P", render: (v) => <span className="mono font-semibold">{v}</span> },
    { key: "impacto", title: "I", render: (v) => <span className="mono font-semibold">{v}</span> },
    { key: "nivelRiesgo", title: "Nivel", render: (v) => { const c = nivelColor(v); return <span className="font-semibold mono px-2 py-1 rounded" style={{ backgroundColor: c.bg, color: c.text, fontSize: 12 }}>{v}</span>; } },
    { key: "controlExistente", title: "Control", render: (v) => <span className="text-xs">{v || "Sin control"}</span> },
    { key: "responsable", title: "Responsable", render: (v) => <span className="text-xs">{v || "—"}</span> },
    { key: "estado", title: "Estado", render: (v) => <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}>{v}</span> },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Gestión de Riesgos"
        subtitle={`${total} riesgos identificados · Paso 6 Resolución 40595`}
        actions={
          <div className="flex gap-2">
            <ClaudeButton onClick={handleIA} loading={iaLoading} label="Programa Riesgos Críticos" />
            <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              <Plus size={15} /> Nuevo riesgo
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Matriz 5x5 */}
        <div className="bg-white rounded-xl p-5" style={{ boxShadow: "var(--shadow)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Matriz de Calor 5×5 — Valoración de Riesgos</h3>
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-right pr-3" style={{ color: "var(--text-muted)" }}>P / I →</th>
                  {[1,2,3,4,5].map((i) => (
                    <th key={i} className="p-2 text-center w-20" style={{ color: "var(--text-muted)" }}>
                      {i === 1 ? "Muy bajo" : i === 2 ? "Bajo" : i === 3 ? "Medio" : i === 4 ? "Alto" : "Muy alto"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[5,4,3,2,1].map((p) => (
                  <tr key={p}>
                    <td className="p-2 text-right font-medium pr-3" style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {p === 5 ? "Muy alta" : p === 4 ? "Alta" : p === 3 ? "Media" : p === 2 ? "Baja" : "Muy baja"}
                    </td>
                    {[1,2,3,4,5].map((i) => {
                      const nivel = p * i;
                      const c = nivelColor(nivel);
                      const celdaData = getCelda(p, i);
                      const count = celdaData?.riesgos?.length || 0;
                      return (
                        <td
                          key={i}
                          onClick={() => count > 0 && setCelda(celdaData)}
                          className={`w-20 h-12 text-center rounded transition-all border ${count > 0 ? "cursor-pointer hover:opacity-80" : ""}`}
                          style={{ backgroundColor: c.bg, color: c.text, border: "2px solid white" }}
                        >
                          <div className="font-semibold mono">{nivel}</div>
                          {count > 0 && <div style={{ fontSize: 10 }}>{count} riesgo{count > 1 ? "s" : ""}</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-4 mt-3">
              {[{ label: "Bajo (1-4)", color: nivelColor(2) }, { label: "Moderado (5-9)", color: nivelColor(6) }, { label: "Alto (10-14)", color: nivelColor(12) }, { label: "Crítico (15-25)", color: nivelColor(20) }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: l.color.bg, border: `1px solid ${l.color.text}` }} />
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <DataTable columns={columns} data={riesgos} loading={loading} emptyTitle="Sin riesgos registrados" emptySubtitle="Agrega riesgos identificados en la evaluación de seguridad vial" />
      </div>

      {/* Panel celda */}
      <Modal open={!!celda} onClose={() => setCelda(null)} title={`Riesgos — Nivel ${celda?.nivel || ""}`} size="md">
        {celda?.riesgos?.map((r) => (
          <div key={r.id} className="mb-3 p-3 rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{r.nombre}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{r.descripcion}</div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--info-bg)", color: "var(--info)" }}>{r.categoria}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Responsable: {r.responsable || "—"}</span>
            </div>
          </div>
        ))}
      </Modal>

      {/* Modal nuevo riesgo */}
      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Registrar nuevo riesgo" size="md"
        footer={
          <>
            <button onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancelar</button>
            <button onClick={handleCrear} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>Guardar riesgo</button>
          </>
        }
      >
        <form onSubmit={handleCrear} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nombre del riesgo</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Categoría</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                {categorias.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Probabilidad (1-5)</label>
              <input type="number" min={1} max={5} value={form.probabilidad} onChange={(e) => setForm({ ...form, probabilidad: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Impacto (1-5)</label>
              <input type="number" min={1} max={5} value={form.impacto} onChange={(e) => setForm({ ...form, impacto: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Control existente</label>
              <input value={form.controlExistente} onChange={(e) => setForm({ ...form, controlExistente: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Responsable</label>
              <input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
            </div>
          </div>
        </form>
      </Modal>

      <ClaudeOutputModal open={iaModal} onClose={() => setIaModal(false)} contenido={iaContenido} onSave={handleGuardar} saving={savingDoc} />
    </div>
  );
}
