const variants = {
  // Estados de documentos
  APROBADO:       { bg: "var(--success-bg)",  text: "var(--success)",  label: "Aprobado" },
  REVISION:       { bg: "var(--warning-bg)",  text: "var(--warning)",  label: "En Revisión" },
  BORRADOR:       { bg: "#F3F4F6",             text: "#6B7280",         label: "Borrador" },
  OBSOLETO:       { bg: "#FEE2E2",             text: "#991B1B",         label: "Obsoleto" },

  // Estados generales
  activo:         { bg: "var(--success-bg)",  text: "var(--success)",  label: "Activo" },
  operativo:      { bg: "var(--success-bg)",  text: "var(--success)",  label: "Operativo" },
  suspendido:     { bg: "var(--danger-bg)",   text: "var(--danger)",   label: "Suspendido" },
  mantenimiento:  { bg: "var(--warning-bg)",  text: "var(--warning)",  label: "Mantenimiento" },
  inactivo:       { bg: "#F3F4F6",             text: "#6B7280",         label: "Inactivo" },

  // Incidentes
  REPORTADO:        { bg: "var(--info-bg)",    text: "var(--info)",     label: "Reportado" },
  EN_INVESTIGACION: { bg: "var(--warning-bg)", text: "var(--warning)",  label: "En Investigación" },
  CERRADO:          { bg: "var(--success-bg)", text: "var(--success)",  label: "Cerrado" },

  // Severidad / alertas
  CRITICO:        { bg: "var(--danger-bg)",   text: "var(--danger)",   label: "Crítico" },
  ALTO:           { bg: "#FEF3C7",             text: "#92400E",         label: "Alto" },
  MODERADO:       { bg: "var(--info-bg)",      text: "var(--info)",     label: "Moderado" },
  BAJO:           { bg: "var(--success-bg)",   text: "var(--success)",  label: "Bajo" },

  // Vencimientos
  VENCIDO:        { bg: "var(--danger-bg)",   text: "var(--danger)",   label: "Vencido" },
  VENCIDA:        { bg: "var(--danger-bg)",   text: "var(--danger)",   label: "Vencida" },
  PROXIMO:        { bg: "var(--warning-bg)",  text: "var(--warning)",  label: "Próximo" },
  PROXIMA:        { bg: "var(--warning-bg)",  text: "var(--warning)",  label: "Próxima" },
  CRITICA:        { bg: "var(--danger-bg)",   text: "var(--danger)",   label: "Crítica" },

  // IA
  IA:             { bg: "#EDE9FE",             text: "#5B21B6",         label: "Generado con IA" },
};

export default function StatusBadge({ status, label: customLabel, size = "sm" }) {
  const v = variants[status] || { bg: "#F3F4F6", text: "#6B7280", label: status };
  const label = customLabel || v.label;
  const px = size === "xs" ? "6px" : "8px";
  const py = size === "xs" ? "2px" : "3px";

  return (
    <span
      className="inline-flex items-center rounded-full font-medium whitespace-nowrap"
      style={{
        backgroundColor: v.bg, color: v.text,
        fontSize: size === "xs" ? 10 : 11,
        paddingLeft: px, paddingRight: px,
        paddingTop: py, paddingBottom: py,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}
