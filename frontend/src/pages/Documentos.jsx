import { useState, useEffect, useCallback } from "react";
import { Plus, Eye, Edit2, Download, Trash2, FileText } from "lucide-react";
import Header from "../components/layout/Header";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import ClaudeButton from "../components/ia/ClaudeButton";
import ClaudeOutputModal from "../components/ia/ClaudeOutputModal";
import { getDocumentos, crearDocumento, actualizarDocumento, eliminarDocumento } from "../services/documentos.service";
import { generarDocumento } from "../services/ia.service";

const fmtFecha = (d) => new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });

const CATEGORIAS = ["Todos", "Políticas", "Procedimientos", "Actas", "Formatos", "Programas", "Indicadores"];

const TIPOS_IA = [
  { value: "POLITICA_SEGURIDAD_VIAL", label: "Política de Seguridad Vial (Paso 3)" },
  { value: "PROCEDIMIENTO_RIESGOS", label: "Procedimiento de Gestión de Riesgos (Paso 6)" },
  { value: "ACTA_COMITE", label: "Acta de Comité PESV (Paso 2)" },
  { value: "PROGRAMA_RIESGOS_CRITICOS", label: "Programa de Riesgos Críticos (Paso 8)" },
  { value: "INDICADORES_PASO20", label: "Indicadores del PESV — Paso 20" },
  { value: "INFORME_EJECUTIVO", label: "Informe de Cumplimiento Mensual" },
];

const categoriaFromTipoIA = {
  POLITICA_SEGURIDAD_VIAL: "Políticas",
  PROCEDIMIENTO_RIESGOS: "Procedimientos",
  ACTA_COMITE: "Actas",
  PROGRAMA_RIESGOS_CRITICOS: "Programas",
  INDICADORES_PASO20: "Indicadores",
  INFORME_EJECUTIVO: "Indicadores",
};

export default function Documentos() {
  const [tab, setTab] = useState("Todos");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [modalVer, setModalVer] = useState(false);
  const [docSeleccionado, setDocSeleccionado] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalIA, setModalIA] = useState(false);
  const [tipoIA, setTipoIA] = useState("POLITICA_SEGURIDAD_VIAL");
  const [iaLoading, setIaLoading] = useState(false);
  const [iaContenido, setIaContenido] = useState("");
  const [iaModal, setIaModal] = useState(false);
  const [savingDoc, setSavingDoc] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({ titulo: "", categoria: "Políticas", estado: "BORRADOR", contenido: "" });

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getDocumentos({ categoria: tab === "Todos" ? undefined : tab, page });
      setData(res.data);
      setTotal(res.total);
      setPages(res.pages);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { setPage(1); }, [tab]);

  const handleGenerarIA = async () => {
    setIaLoading(true);
    try {
      const { data } = await generarDocumento(tipoIA);
      setIaContenido(data.contenido);
      setModalIA(false);
      setIaModal(true);
    } catch {
      alert("Error al generar con IA. Verifica tu clave API.");
    } finally {
      setIaLoading(false);
    }
  };

  const handleGuardarIADoc = async () => {
    setSavingDoc(true);
    try {
      const cat = categoriaFromTipoIA[tipoIA] || "Programas";
      const tit = TIPOS_IA.find((t) => t.value === tipoIA)?.label || "Documento IA";
      await crearDocumento({ titulo: tit, categoria: cat, contenido: iaContenido, estado: "BORRADOR", generadoIA: true });
      setIaModal(false);
      cargar();
    } finally {
      setSavingDoc(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearDocumento(form);
      setModalNuevo(false);
      setForm({ titulo: "", categoria: "Políticas", estado: "BORRADOR", contenido: "" });
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || "Error al crear documento");
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este documento? Esta acción no se puede deshacer.")) return;
    await eliminarDocumento(id);
    cargar();
  };

  const columns = [
    {
      key: "titulo", title: "Nombre",
      render: (v, row) => (
        <div>
          <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{v}</div>
          {row.generadoIA && <StatusBadge status="IA" size="xs" />}
        </div>
      ),
    },
    { key: "categoria", title: "Categoría", render: (v) => <span className="text-xs">{v}</span> },
    { key: "version", title: "Versión", render: (v) => <span className="mono text-xs">v{v}</span> },
    { key: "updatedAt", title: "Actualizado", render: (v) => <span className="text-xs">{fmtFecha(v)}</span> },
    { key: "estado", title: "Estado", render: (v) => <StatusBadge status={v} /> },
    {
      key: "usuario", title: "Responsable",
      render: (v) => <span className="text-xs">{v?.nombre || "—"}</span>,
    },
    {
      key: "acciones", title: "Acciones",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setDocSeleccionado(row); setModalVer(true); }} className="p-1 rounded hover:bg-gray-100" title="Ver">
            <Eye size={14} style={{ color: "var(--text-muted)" }} />
          </button>
          <button className="p-1 rounded hover:bg-gray-100" title="Descargar">
            <Download size={14} style={{ color: "var(--text-muted)" }} />
          </button>
          <button onClick={() => handleEliminar(row.id)} className="p-1 rounded hover:bg-gray-100" title="Eliminar">
            <Trash2 size={14} style={{ color: "var(--danger)" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Documentos PESV"
        subtitle={`${total} documentos · Resolución 40595 de 2022`}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        actions={
          <div className="flex gap-2">
            <ClaudeButton onClick={() => setModalIA(true)} label="Generar con IA" />
            <button
              onClick={() => setModalNuevo(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Plus size={15} /> Nuevo
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-5 overflow-x-auto">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors"
              style={{
                backgroundColor: tab === c ? "var(--accent)" : "white",
                color: tab === c ? "white" : "var(--text-secondary)",
                border: `1px solid ${tab === c ? "var(--accent)" : "var(--border)"}`,
                fontWeight: tab === c ? 500 : 400,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={setPage}
          emptyTitle="Sin documentos"
          emptySubtitle="Crea tu primer documento o genera uno con IA"
          emptyAction={<ClaudeButton onClick={() => setModalIA(true)} label="Generar con IA" />}
        />
      </div>

      {/* Modal Ver documento */}
      <Modal open={modalVer} onClose={() => setModalVer(false)} title={docSeleccionado?.titulo || "Documento"} size="lg">
        {docSeleccionado && (
          <div>
            <div className="flex gap-2 mb-4">
              <StatusBadge status={docSeleccionado.estado} />
              {docSeleccionado.generadoIA && <StatusBadge status="IA" />}
              <span className="mono text-xs self-center" style={{ color: "var(--text-muted)" }}>v{docSeleccionado.version}</span>
            </div>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed rounded-xl p-4 overflow-auto" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)", maxHeight: 500, fontFamily: "DM Mono, monospace", fontSize: 12 }}>
              {docSeleccionado.contenido}
            </pre>
          </div>
        )}
      </Modal>

      {/* Modal tipo IA */}
      <Modal
        open={modalIA}
        onClose={() => setModalIA(false)}
        title="Generar documento con IA"
        size="sm"
        footer={
          <>
            <button onClick={() => setModalIA(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Cancelar
            </button>
            <ClaudeButton onClick={handleGenerarIA} loading={iaLoading} label="Generar" />
          </>
        }
      >
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Selecciona el tipo de documento a generar conforme a la Resolución 40595:</p>
        <div className="space-y-2">
          {TIPOS_IA.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors"
              style={{ borderColor: tipoIA === t.value ? "var(--accent)" : "var(--border)", backgroundColor: tipoIA === t.value ? "var(--accent-light)" : "white" }}
            >
              <input type="radio" name="tipoIA" value={t.value} checked={tipoIA === t.value} onChange={(e) => setTipoIA(e.target.value)} className="accent-blue-600" />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{t.label}</span>
            </label>
          ))}
        </div>
      </Modal>

      {/* Modal nuevo documento manual */}
      <Modal
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        title="Nuevo documento"
        size="md"
        footer={
          <>
            <button onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Cancelar
            </button>
            <button onClick={handleCrear} className="px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--accent)" }}>
              Crear documento
            </button>
          </>
        }
      >
        <form onSubmit={handleCrear} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Título</label>
            <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Categoría</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                {CATEGORIAS.filter((c) => c !== "Todos").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Estado</label>
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
                <option value="BORRADOR">Borrador</option>
                <option value="REVISION">En Revisión</option>
                <option value="APROBADO">Aprobado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Contenido</label>
            <textarea value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} rows={8} required className="w-full px-3 py-2 rounded-lg border text-sm font-mono resize-none" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", fontSize: 12 }} />
          </div>
        </form>
      </Modal>

      <ClaudeOutputModal open={iaModal} onClose={() => setIaModal(false)} contenido={iaContenido} onSave={handleGuardarIADoc} saving={savingDoc} />
    </div>
  );
}
