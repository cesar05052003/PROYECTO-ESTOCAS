import { useState } from "react";
import { Award, Download, Share2, Calendar, CheckCircle, X } from "lucide-react";
import Modal from "../ui/Modal";
import { generarCertificado } from "../../services/capacitaciones.service";

export default function VerCertificado({ open, onClose, usuarioCapacitacion }) {
  const [generando, setGenerando] = useState(false);
  const [certificadoUrl, setCertificadoUrl] = useState(usuarioCapacitacion?.certificadoUrl || null);

  const handleGenerarCertificado = async () => {
    setGenerando(true);
    try {
      const response = await generarCertificado(usuarioCapacitacion.id);
      setCertificadoUrl(response.data.certificadoUrl);
    } catch (err) {
      console.error("Error al generar certificado:", err);
    } finally {
      setGenerando(false);
    }
  };

  const handleDescargar = () => {
    if (certificadoUrl) {
      window.open(certificadoUrl, "_blank");
    }
  };

  const fechaCompletado = usuarioCapacitacion?.completadoEn
    ? new Date(usuarioCapacitacion.completadoEn).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Modal open={open} onClose={onClose} title="Certificado de Capacitación" size="md">
      <div className="space-y-6">
        <div className="p-6 rounded-xl border-2 text-center" style={{ borderColor: "var(--primary)", backgroundColor: "var(--primary-bg)" }}>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--success-bg)" }}>
              <Award size={48} style={{ color: "var(--success)" }} />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Certificado de Aprobación
          </h2>

          <div className="space-y-3 mt-6">
            <div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                Se certifica que
              </div>
              <div className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {usuarioCapacitacion?.usuario?.nombre || "Usuario"}
              </div>
            </div>

            <div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                Ha completado satisfactoriamente la capacitación
              </div>
              <div className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {usuarioCapacitacion?.capacitacion?.titulo || "Capacitación"}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2" style={{ color: "var(--text-muted)" }}>
              <Calendar size={16} />
              <span className="text-sm">{fechaCompletado}</span>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <CheckCircle size={20} style={{ color: "var(--success)" }} />
              <span className="text-lg font-bold" style={{ color: "var(--success)" }}>
                Puntaje: {usuarioCapacitacion?.puntaje}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!certificadoUrl ? (
            <button
              onClick={handleGenerarCertificado}
              disabled={generando}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Award size={16} />
              {generando ? "Generando..." : "Generar Certificado"}
            </button>
          ) : (
            <>
              <button
                onClick={handleDescargar}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Download size={16} />
                Descargar PDF
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Certificado de Capacitación",
                      text: `He completado la capacitación ${usuarioCapacitacion?.capacitacion?.titulo} con un puntaje de ${usuarioCapacitacion?.puntaje}%`,
                      url: certificadoUrl,
                    });
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <Share2 size={16} />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            <X size={16} />
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
