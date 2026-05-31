const prisma = require("../../config/db");

const DIAS_PROXIMA_REVISION = { PREVENTIVO: 90, CORRECTIVO: 30, REVISION: 180 };

const listar = async (req, res, next) => {
  try {
    const { vehiculoId } = req.query;
    const where = vehiculoId ? { vehiculoId } : {};
    const mantenimientos = await prisma.mantenimiento.findMany({
      where,
      orderBy: { fecha: "desc" },
      include: { vehiculo: { select: { placa: true, marca: true, modelo: true, estado: true } } },
    });
    res.json(mantenimientos);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { vehiculoId, tipo, descripcion, costo, fecha, proximaRevision, taller } = req.body;

    if (!vehiculoId || !tipo || !descripcion || !fecha) {
      return res.status(400).json({ error: "Vehículo, tipo, descripción y fecha son obligatorios." });
    }

    if (costo !== undefined && costo !== null && costo !== "" && parseFloat(costo) < 0) {
      return res.status(400).json({ error: "El costo no puede ser negativo." });
    }

    const fechaMant = new Date(fecha);
    if (fechaMant > new Date()) {
      return res.status(400).json({ error: "La fecha del mantenimiento no puede ser futura. Registre el mantenimiento cuando ya haya ocurrido." });
    }

    const vehiculo = await prisma.vehiculo.findUnique({ where: { id: vehiculoId }, select: { placa: true, estado: true } });
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado." });

    // Calcular proximaRevision automáticamente si no se provee
    let proxRev = proximaRevision ? new Date(proximaRevision) : null;
    if (!proxRev) {
      const diasOffset = DIAS_PROXIMA_REVISION[tipo?.toUpperCase()] || 90;
      proxRev = new Date(fechaMant);
      proxRev.setDate(proxRev.getDate() + diasOffset);
    }

    const [mantenimiento] = await prisma.$transaction([
      prisma.mantenimiento.create({
        data: {
          vehiculoId,
          tipo,
          descripcion,
          costo: costo ? parseFloat(costo) : null,
          fecha: fechaMant,
          proximaRevision: proxRev,
          taller,
        },
      }),
      prisma.vehiculo.update({
        where: { id: vehiculoId },
        data: { estado: "EN_MANTENIMIENTO" },
      }),
    ]);

    res.status(201).json({ ...mantenimiento, proximaRevisionCalculada: !proximaRevision });
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fecha) data.fecha = new Date(data.fecha);
    if (data.proximaRevision) data.proximaRevision = new Date(data.proximaRevision);
    if (data.costo !== undefined) data.costo = data.costo ? parseFloat(data.costo) : null;
    const mantenimiento = await prisma.mantenimiento.update({ where: { id: req.params.id }, data });
    res.json(mantenimiento);
  } catch (err) { next(err); }
};

const completar = async (req, res, next) => {
  try {
    const mantenimiento = await prisma.mantenimiento.findUnique({
      where: { id: req.params.id },
      select: { vehiculoId: true, tipo: true },
    });
    if (!mantenimiento) return res.status(404).json({ error: "Mantenimiento no encontrado." });

    await prisma.vehiculo.update({
      where: { id: mantenimiento.vehiculoId },
      data: { estado: "ACTIVO" },
    });

    res.json({ mensaje: "Mantenimiento completado. El vehículo ha vuelto al estado ACTIVO." });
  } catch (err) { next(err); }
};

const proximos = async (req, res, next) => {
  try {
    const hoy = new Date();
    const en30dias = new Date();
    en30dias.setDate(hoy.getDate() + 30);
    const en7dias = new Date();
    en7dias.setDate(hoy.getDate() + 7);

    const mantenimientos = await prisma.mantenimiento.findMany({
      where: { proximaRevision: { gte: hoy, lte: en30dias } },
      orderBy: { proximaRevision: "asc" },
      include: { vehiculo: { select: { placa: true, marca: true, modelo: true, estado: true } } },
    });

    const resultado = mantenimientos.map((m) => {
      const dias = Math.ceil((new Date(m.proximaRevision) - hoy) / (1000 * 60 * 60 * 24));
      let urgencia = "este_mes";
      if (dias <= 0) urgencia = "hoy";
      else if (dias <= 7) urgencia = "esta_semana";
      return { ...m, diasRestantes: dias, urgencia };
    });

    res.json({
      total: resultado.length,
      hoy: resultado.filter((m) => m.urgencia === "hoy"),
      esta_semana: resultado.filter((m) => m.urgencia === "esta_semana"),
      este_mes: resultado.filter((m) => m.urgencia === "este_mes"),
    });
  } catch (err) { next(err); }
};

const estadisticas = async (req, res, next) => {
  try {
    const hoy = new Date();
    const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);

    const todos = await prisma.mantenimiento.findMany({
      select: { costo: true, tipo: true, fecha: true, vehiculoId: true, vehiculo: { select: { placa: true, marca: true } } },
    });

    // Costo total
    const costoTotal = todos.reduce((sum, m) => sum + (m.costo || 0), 0);

    // Por tipo
    const porTipo = {};
    todos.forEach((m) => {
      const t = m.tipo || "OTRO";
      if (!porTipo[t]) porTipo[t] = { tipo: t, cantidad: 0, costo: 0 };
      porTipo[t].cantidad += 1;
      porTipo[t].costo += m.costo || 0;
    });

    // Por vehículo (top 5 más costosos)
    const porVehiculo = {};
    todos.forEach((m) => {
      const key = m.vehiculoId;
      if (!porVehiculo[key]) porVehiculo[key] = { placa: m.vehiculo?.placa, marca: m.vehiculo?.marca, cantidad: 0, costo: 0 };
      porVehiculo[key].cantidad += 1;
      porVehiculo[key].costo += m.costo || 0;
    });
    const topVehiculos = Object.values(porVehiculo)
      .sort((a, b) => b.costo - a.costo)
      .slice(0, 5)
      .map((v) => ({ ...v, costo: parseFloat(v.costo.toFixed(2)) }));

    // Por mes (últimos 6 meses)
    const porMes = {};
    todos
      .filter((m) => new Date(m.fecha) >= hace6Meses)
      .forEach((m) => {
        const d = new Date(m.fecha);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!porMes[key]) porMes[key] = { mes: key, cantidad: 0, costo: 0 };
        porMes[key].cantidad += 1;
        porMes[key].costo += m.costo || 0;
      });
    const costosPorMes = Object.values(porMes)
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .map((m) => ({ ...m, costo: parseFloat(m.costo.toFixed(2)) }));

    res.json({
      costoTotal: parseFloat(costoTotal.toFixed(2)),
      totalMantenimientos: todos.length,
      porTipo: Object.values(porTipo).map((t) => ({ ...t, costo: parseFloat(t.costo.toFixed(2)) })),
      topVehiculos,
      costosPorMes,
    });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar, completar, proximos, estadisticas };
