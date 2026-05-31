const prisma = require("../../config/db");

const kpis = async (req, res, next) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const mesAnteriorInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const mesAnteriorFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    const [
      conductoresActivos, totalConductores, vehiculosOperativos, totalVehiculos,
      incidentesMes, incidentesMesAnterior, documentosAprobados, totalDocumentos,
      conductoresConCapacitacion, alertasSinLeer,
    ] = await Promise.all([
      prisma.conductor.count({ where: { estado: "activo" } }),
      prisma.conductor.count(),
      prisma.vehiculo.count({ where: { estado: "ACTIVO" } }),
      prisma.vehiculo.count(),
      prisma.incidente.count({ where: { fecha: { gte: inicioMes } } }),
      prisma.incidente.count({ where: { fecha: { gte: mesAnteriorInicio, lte: mesAnteriorFin } } }),
      prisma.documento.count({ where: { estado: "APROBADO" } }),
      prisma.documento.count(),
      prisma.usuarioCapacitacion.groupBy({ by: ["conductorId"], where: { aprobado: true, conductorId: { not: null } } }),
      prisma.alerta.count({ where: { leida: false } }),
    ]);

    const cumplimiento = totalDocumentos > 0 ? Math.round((documentosAprobados / totalDocumentos) * 100) : 0;
    const tendenciaIncidentes = incidentesMes - incidentesMesAnterior;

    res.json({
      conductoresActivos, totalConductores, vehiculosOperativos, totalVehiculos,
      incidentesMes, incidentesMesAnterior, tendenciaIncidentes, cumplimiento,
      documentosAprobados, totalDocumentos,
      conductoresCapacitados: conductoresConCapacitacion.length,
      alertasSinLeer,
    });
  } catch (err) { next(err); }
};

const accidentalidad = async (req, res, next) => {
  try {
    const hace6meses = new Date();
    hace6meses.setMonth(hace6meses.getMonth() - 6);

    const incidentes = await prisma.incidente.findMany({
      where: { fecha: { gte: hace6meses } },
      select: { tipo: true, fecha: true },
      orderBy: { fecha: "asc" },
    });

    const meses = {};
    const mesNombres = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    incidentes.forEach((inc) => {
      const d = new Date(inc.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!meses[key]) meses[key] = { mes: mesNombres[d.getMonth()], accidentes: 0, casiAccidentes: 0 };
      if (inc.tipo.startsWith("ACCIDENTE")) meses[key].accidentes++;
      else if (inc.tipo === "CASI_ACCIDENTE") meses[key].casiAccidentes++;
    });

    res.json(Object.values(meses));
  } catch (err) { next(err); }
};

const alertasRecientes = async (req, res, next) => {
  try {
    const alertas = await prisma.alerta.findMany({
      where: { leida: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    res.json(alertas);
  } catch (err) { next(err); }
};

const cumplimiento = async (req, res, next) => {
  try {
    const [totalDocs, aprobados, totalCaps, completadas, totalRiesgos, conControl, totalVeh, operativos, totalInc, cerrados] = await Promise.all([
      prisma.documento.count(),
      prisma.documento.count({ where: { estado: "APROBADO" } }),
      prisma.capacitacion.count({ where: { activo: true } }),
      prisma.usuarioCapacitacion.count({ where: { aprobado: true } }),
      prisma.riesgo.count(),
      prisma.riesgo.count({ where: { estado: { in: ["CONTROLADO", "EN_TRATAMIENTO"] } } }),
      prisma.vehiculo.count(),
      prisma.vehiculo.count({ where: { estado: "ACTIVO" } }),
      prisma.incidente.count(),
      prisma.incidente.count({ where: { estado: "CERRADO" } }),
    ]);

    res.json([
      { nombre: "Documentos PESV", porcentaje: totalDocs > 0 ? Math.round((aprobados / totalDocs) * 100) : 0, color: "#1B6CA8" },
      { nombre: "Capacitaciones", porcentaje: totalCaps > 0 ? Math.min(100, Math.round((completadas / (totalCaps * 5)) * 100)) : 0, color: "#166534" },
      { nombre: "Gestión Riesgos", porcentaje: totalRiesgos > 0 ? Math.round((conControl / totalRiesgos) * 100) : 0, color: "#92400E" },
      { nombre: "Control Flota", porcentaje: totalVeh > 0 ? Math.round((operativos / totalVeh) * 100) : 0, color: "#1E40AF" },
      { nombre: "Cierre Incidentes", porcentaje: totalInc > 0 ? Math.round((cerrados / totalInc) * 100) : 0, color: "#991B1B" },
    ]);
  } catch (err) { next(err); }
};

const costos = async (req, res, next) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const mesAnteriorInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const mesAnteriorFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    const [incMes, incAnterior, mantMes, mantAnterior] = await Promise.all([
      prisma.incidente.findMany({ where: { fecha: { gte: inicioMes }, costoEstimado: { not: null } }, select: { costoEstimado: true } }),
      prisma.incidente.findMany({ where: { fecha: { gte: mesAnteriorInicio, lte: mesAnteriorFin }, costoEstimado: { not: null } }, select: { costoEstimado: true } }),
      prisma.mantenimiento.findMany({ where: { fecha: { gte: inicioMes }, costo: { not: null } }, select: { costo: true } }),
      prisma.mantenimiento.findMany({ where: { fecha: { gte: mesAnteriorInicio, lte: mesAnteriorFin }, costo: { not: null } }, select: { costo: true } }),
    ]);

    const costoIncMes = incMes.reduce((s, i) => s + (i.costoEstimado || 0), 0);
    const costoIncAnterior = incAnterior.reduce((s, i) => s + (i.costoEstimado || 0), 0);
    const costoMantMes = mantMes.reduce((s, m) => s + (m.costo || 0), 0);
    const costoMantAnterior = mantAnterior.reduce((s, m) => s + (m.costo || 0), 0);

    res.json({
      costoIncidentesMes: costoIncMes,
      costoIncidentesAnterior: costoIncAnterior,
      costoMantenimientosMes: costoMantMes,
      costoMantenimientosAnterior: costoMantAnterior,
      costoTotalMes: costoIncMes + costoMantMes,
    });
  } catch (err) { next(err); }
};

const marcarAlertaLeida = async (req, res, next) => {
  try {
    await prisma.alerta.update({ where: { id: req.params.id }, data: { leida: true } });
    res.json({ ok: true });
  } catch (err) { next(err); }
};

module.exports = { kpis, accidentalidad, alertasRecientes, cumplimiento, costos, marcarAlertaLeida };
