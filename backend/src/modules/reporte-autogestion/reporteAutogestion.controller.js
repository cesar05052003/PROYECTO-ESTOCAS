const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const reportes = await prisma.reporteAutogestion.findMany({ orderBy: [{ anio: "desc" }, { mes: "desc" }] });
    res.json(reportes);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const { anio, mes } = req.params;
    const reporte = await prisma.reporteAutogestion.findFirst({
      where: { anio: parseInt(anio), mes: parseInt(mes) },
    });
    if (!reporte) return res.status(404).json({ error: "No encontrado" });
    res.json(reporte);
  } catch (err) { next(err); }
};

const generar = async (req, res, next) => {
  try {
    const hoy = new Date();
    const anio = req.body.anio || hoy.getFullYear();
    const mes = req.body.mes || hoy.getMonth() + 1;

    const inicioMes = new Date(anio, mes - 1, 1);
    const finMes = new Date(anio, mes, 0, 23, 59, 59);
    const anioInicio = new Date(anio, 0, 1);
    const anioFin = new Date(anio, 11, 31, 23, 59, 59);

    const [
      totalConductores, capacitados, totalVehiculos, vehiculosMantenidos,
      inspecciones, incidentes, vehiculosConPrograma,
    ] = await Promise.all([
      prisma.conductor.count(),
      prisma.usuarioCapacitacion.groupBy({ by: ["conductorId"], where: { aprobado: true, conductorId: { not: null } } }),
      prisma.vehiculo.count(),
      prisma.vehiculo.count({ where: { estado: "ACTIVO" } }),
      prisma.inspeccionVehiculo.count({ where: { fecha: { gte: inicioMes, lte: finMes } } }),
      prisma.incidente.findMany({ where: { fecha: { gte: inicioMes, lte: finMes } } }),
      prisma.mantenimiento.groupBy({ by: ["vehiculoId"], where: { fecha: { gte: anioInicio, lte: anioFin } } }),
    ]);

    const muertos = incidentes.reduce((sum, i) => sum + i.muertos, 0);
    const lesionados = incidentes.reduce((sum, i) => sum + i.lesionados, 0);
    const accidentes = incidentes.filter((i) => i.tipo.startsWith("ACCIDENTE")).length;
    const excesoVelocidad = incidentes.filter((i) => i.tipo.toUpperCase().includes("VELOCIDAD")).length;
    const jornadaExcedida = incidentes.filter((i) => i.tipo.toUpperCase().includes("JORNADA")).length;
    const diasTrabajados = req.body.diasLaborables ? parseInt(req.body.diasLaborables) : 22;

    const indCapacitaciones = totalConductores > 0 ? parseFloat(((capacitados.length / totalConductores) * 100).toFixed(1)) : 0;
    const indMantenimiento = totalVehiculos > 0 ? parseFloat(((vehiculosMantenidos / totalVehiculos) * 100).toFixed(1)) : 0;
    const indVehiculosPrograma = totalVehiculos > 0 ? parseFloat(((vehiculosConPrograma.length / totalVehiculos) * 100).toFixed(1)) : 0;
    const cumplimientoGeneral = parseFloat(((indCapacitaciones + indMantenimiento + indVehiculosPrograma) / 3).toFixed(1));

    const datos = {
      anio, mes,
      indicadorMetas: 0,
      indicadorAccidentes: diasTrabajados > 0 && totalConductores > 0
        ? parseFloat(((accidentes / (totalConductores * diasTrabajados)) * 100).toFixed(2))
        : 0,
      indicadorMuertos: muertos,
      indicadorLesionados: lesionados,
      indicadorCapacitaciones: indCapacitaciones,
      indicadorMantenimiento: indMantenimiento,
      indicadorInspecciones: inspecciones,
      indicadorExcesoVelocidad: excesoVelocidad,
      indicadorJornadaExcedida: jornadaExcedida,
      indicadorVehiculosPrograma: indVehiculosPrograma,
      cumplimientoGeneral,
      observaciones: `Reporte generado automáticamente para ${mes}/${anio}`,
      generadoIA: false,
    };

    const existente = await prisma.reporteAutogestion.findFirst({ where: { anio, mes } });
    const reporte = existente
      ? await prisma.reporteAutogestion.update({ where: { id: existente.id }, data: datos })
      : await prisma.reporteAutogestion.create({ data: datos });

    res.status(201).json(reporte);
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, generar };
