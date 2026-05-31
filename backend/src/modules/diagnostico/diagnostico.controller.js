const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const diagnosticos = await prisma.diagnostico.findMany({
      orderBy: { anio: "desc" },
      include: { riesgos: { select: { id: true, nombre: true, nivelRiesgo: true, estado: true } } },
    });
    res.json(diagnosticos);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { anio, descripcion, hallazgos, conclusiones } = req.body;
    const diagnostico = await prisma.diagnostico.create({
      data: { anio, descripcion, hallazgos, conclusiones },
    });
    res.status(201).json(diagnostico);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const diagnostico = await prisma.diagnostico.findUnique({
      where: { id: req.params.id },
      include: { riesgos: true },
    });
    if (!diagnostico) return res.status(404).json({ error: "No encontrado" });
    res.json(diagnostico);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const diagnostico = await prisma.diagnostico.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(diagnostico);
  } catch (err) { next(err); }
};

const nivelMadurez = async (req, res, next) => {
  try {
    const [
      lideres, comites, reuniones, documentos, diagnosticos, riesgos,
      programasRiesgo, planesAnuales, capacitaciones, capacitados,
      emergencias, desplazamientos, inspecciones, mantenimientos,
      reportes, auditorias, acciones, versiones,
      incidentesCerrados,
    ] = await Promise.all([
      prisma.miembroComite.count({ where: { esLider: true } }),
      prisma.comiteSeguridadVial.count(),
      prisma.reunionComite.count(),
      prisma.documento.count(),
      prisma.diagnostico.count(),
      prisma.riesgo.count(),
      prisma.programaRiesgoCritico.count(),
      prisma.planAnualTrabajo.count(),
      prisma.capacitacion.count({ where: { activo: true } }),
      prisma.usuarioCapacitacion.count({ where: { aprobado: true } }),
      prisma.planEmergencia.count(),
      prisma.desplazamiento.count(),
      prisma.inspeccionVehiculo.count(),
      prisma.mantenimiento.count(),
      prisma.reporteAutogestion.count(),
      prisma.auditoria.count(),
      prisma.accionCorrectiva.count(),
      prisma.versionDocumento.count(),
      prisma.incidente.count({ where: { estado: "CERRADO", investigacion: { not: null } } }),
    ]);

    const basicos = [
      { paso: 1, label: "Líder PESV designado", ok: lideres > 0 },
      { paso: 2, label: "Comité de Seguridad Vial", ok: comites > 0 },
      { paso: 3, label: "Política de Seguridad Vial documentada", ok: documentos > 0 },
      { paso: 4, label: "Diagnóstico inicial realizado", ok: diagnosticos > 0 },
      { paso: 5, label: "Caracterización y control de riesgos", ok: riesgos > 0 },
      { paso: 6, label: "Objetivos y metas definidos", ok: planesAnuales > 0 || documentos >= 3 },
      { paso: 7, label: "Programas de riesgos críticos", ok: programasRiesgo > 0 },
      { paso: 8, label: "Plan anual de trabajo", ok: planesAnuales > 0 },
      { paso: 9, label: "Plan de formación y capacitaciones", ok: capacitaciones > 0 && capacitados > 0 },
      { paso: 10, label: "Plan de emergencias", ok: emergencias > 0 },
      { paso: 11, label: "Vías y entornos seguros", ok: documentos >= 5 },
      { paso: 12, label: "Planificación de desplazamientos", ok: desplazamientos > 0 },
      { paso: 13, label: "Inspección de vehículos y equipos", ok: inspecciones > 0 },
      { paso: 14, label: "Mantenimiento y control vehicular", ok: mantenimientos > 0 },
      { paso: 15, label: "Indicadores y reporte autogestión", ok: reportes > 0 },
      { paso: 16, label: "Auditoría anual", ok: auditorias > 0 },
      { paso: 17, label: "Mejora continua — acciones correctivas", ok: acciones > 0 },
      { paso: 18, label: "Mecanismos de comunicación", ok: documentos >= 2 },
    ];

    const estandar = [
      { paso: 19, label: "Reuniones del Comité de Seguridad Vial", ok: reuniones > 0 },
      { paso: 20, label: "Investigación interna de siniestros", ok: incidentesCerrados > 0 },
      { paso: 21, label: "Gestión del cambio y contratistas", ok: documentos >= 8 },
      { paso: 22, label: "Archivo y retención documental", ok: versiones > 0 },
    ];

    const avanzado = [
      { paso: 23, label: "Responsabilidad y comportamiento seguro", ok: capacitados >= 10 },
      { paso: 24, label: "Registro y análisis estadístico de siniestros", ok: reportes >= 3 },
    ];

    const completadosBasico = basicos.filter((p) => p.ok).length;
    const completadosEstandar = estandar.filter((p) => p.ok).length;
    const completadosAvanzado = avanzado.filter((p) => p.ok).length;

    let nivel = "EN_PROCESO";
    if (completadosBasico >= 15) nivel = "BASICO";
    if (completadosBasico >= 15 && completadosEstandar >= 3) nivel = "ESTANDAR";
    if (completadosBasico >= 15 && completadosEstandar >= 3 && completadosAvanzado >= 2) nivel = "AVANZADO";

    res.json({
      nivel,
      basicos: { pasos: basicos, completados: completadosBasico, total: 18, porcentaje: Math.round((completadosBasico / 18) * 100) },
      estandar: { pasos: estandar, completados: completadosEstandar, total: 4, porcentaje: Math.round((completadosEstandar / 4) * 100) },
      avanzado: { pasos: avanzado, completados: completadosAvanzado, total: 2, porcentaje: Math.round((completadosAvanzado / 2) * 100) },
    });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, obtener, actualizar, nivelMadurez };
