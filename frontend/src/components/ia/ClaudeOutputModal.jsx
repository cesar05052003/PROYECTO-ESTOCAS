import { useState } from "react";
import { Copy, Check, Save } from "lucide-react";
import Modal from "../ui/Modal";

export default function ClaudeOutputModal({ open, onClose, contenido, onSave, saving }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contenido || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Resultado generado por IA"
      size="lg"
      footer={
        <>
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" /> : <Save size={14} />}
              {saving ? "Guardando..." : "Guardar en documentos"}
            </button>
          )}
        </>
      }
    >
      <div
        className="rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed overflow-auto font-mono"
        style={{
          backgroundColor: "var(--bg-input)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          maxHeight: 500,
          fontSize: 13,
        }}
      >
        {contenido || "Sin contenido generado."}
      </div>
    </Modal>
  );
}
