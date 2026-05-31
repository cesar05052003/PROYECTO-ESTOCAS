import { useState, useEffect } from "react";
import { BarChart3, Plus } from "lucide-react";
import { getReportes, generarReporte } from "../services/reporteAutogestion.service";
import EmptyState from "../components/ui/EmptyState";
import KpiCard from "../components/ui/KpiCard";

const mesesNombres = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [selected, setSelected] = useState(null);
  const [diasLaborables, setDiasLaborables] = useState(22);

  const cargar = async () => {
    try { const { data } = await getReportes(); setReportes(data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      await generarReporte({ anio: new Date().getFullYear(), mes: new Date().getMonth() + 1, diasLaborables });
      cargar();
    } catch (e) { alert("Error al generar reporte"); }
    setGenerando(false);
  };

  const indicadores = [
    { key: "indicadorMetas", label: "% Metas alcanzadas", suffix: "%" },
    { key: "indicadorAccidentes", label: "Índice accidentalidad", suffix: "%" },
    { key: "indicadorMuertos", label: "Muertos", suffix: "" },
    { key: "indicadorLesionados", label: "Lesionados", suffix: "" },
    { key: "indicadorCapacitaciones", label: "% Capacitados", suffix: "%" },
    { key: "indicadorMantenimiento", label: "% Mantenimiento al día", suffix: "%" },
    { key: "indicadorInspecciones", label: "Inspecciones realizadas", suffix: "" },
    { key: "indicadorExcesoVelocidad", label: "Eventos exceso velocidad", suffix: "" },
    { key: "indicadorJornadaExcedida", label: "Jornada excedida", suffix: "" },
    { key: "indicadorVehiculosPrograma", label: "Vehículos en programa", suffix: "" },
    { key: "cumplimientoGeneral", label: "Cumplimiento general", suffix: "%" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Reportes de Autogestión</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Paso 20 — Indicadores y reporte PESV para el SISI</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Días lab./mes:</label>
            <input
              type="number"
              min={1}
              max={31}
              value={diasLaborables}
              onChange={(e) => setDiasLaborables(parseInt(e.target.value) || 22)}
              className="w-16 px-2 py-1.5 rounded-lg border text-sm text-center"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}
            />
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={handleGenerar} disabled={generando}>
            <Plus size={16} /> {generando ? "Generando..." : "Generar Reporte Mes Actual"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : reportes.length === 0 ? (
        <EmptyState icon={BarChart3} title="Sin reportes" description="Genere el reporte de autogestión mensual con los 13 indicadores oficiales." actionLabel="Generar Reporte" onAction={handleGenerar} />
      ) : (
        <>
          {/* Lista de reportes */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {reportes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="p-4 rounded-xl border text-left transition-all hover:shadow-md"
                style={{
                  borderColor: selected?.id === r.id ? "var(--accent)" : "var(--border)",
                  background: selected?.id === r.id ? "var(--accent-light)" : "white",
                }}
              >
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{mesesNombres[r.mes]}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{r.anio}</div>
                <div className="text-lg font-semibold mt-1" style={{ color: "var(--accent)" }}>{r.cumplimientoGeneral || 0}%</div>
              </button>
            ))}
          </div>

          {/* Detalle del reporte seleccionado */}
          {(selected || reportes[0]) && (() => {
            const r = selected || reportes[0];
            return (
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Reporte {mesesNombres[r.mes]} {r.anio}
                </h3>
                <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>13 Indicadores oficiales — Resolución 40595 de 2022</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {indicadores.map(({ key, label, suffix }) => (
                    <div key={key} className="p-4 rounded-lg" style={{ background: "var(--bg-page)" }}>
                      <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
                      <div className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                        {r[key] != null ? `${r[key]}${suffix}` : "—"}
                      </div>
                    </div>
                  ))}
                </div>

                {r.observaciones && (
                  <div className="mt-4 p-4 rounded-lg" style={{ background: "var(--bg-page)" }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Observaciones</div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{r.observaciones}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
