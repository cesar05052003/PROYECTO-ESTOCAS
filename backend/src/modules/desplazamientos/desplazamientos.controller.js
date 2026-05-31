const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const desplazamientos = await prisma.desplazamiento.findMany({
      orderBy: { fechaSalida: "desc" },
      include: {
        conductor: { include: { usuario: { select: { nombre: true } } } },
        vehiculo: { select: { placa: true, marca: true, modelo: true } },
      },
    });
    res.json(desplazamientos);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { conductorId, vehiculoId, origen, destino, fechaSalida, fechaLlegada, distanciaKm, observaciones } = req.body;

    if (!conductorId || !vehiculoId || !origen || !destino || !fechaSalida) {
      return res.status(400).json({ error: "Conductor, vehículo, origen, destino y fecha de salida son obligatorios." });
    }

    const salida = new Date(fechaSalida);
    const llegada = fechaLlegada ? new Date(fechaLlegada) : null;

    if (llegada && llegada <= salida) {
      return res.status(400).json({ error: "La fecha de llegada debe ser posterior a la fecha de salida." });
    }

    if (distanciaKm !== undefined && distanciaKm !== null && distanciaKm !== "" && parseFloat(distanciaKm) <= 0) {
      return res.status(400).json({ error: "La distancia debe ser mayor a 0 km." });
    }

    const [conductor, vehiculo] = await Promise.all([
      prisma.conductor.findUnique({ where: { id: conductorId }, select: { estado: true, usuario: { select: { nombre: true } } } }),
      prisma.vehiculo.findUnique({ where: { id: vehiculoId }, select: { estado: true, placa: true } }),
    ]);

    if (!conductor) return res.status(404).json({ error: "Conductor no encontrado." });
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado." });

    if (conductor.estado !== "ACTIVO") {
      return res.status(400).json({ error: `El conductor no está disponible (estado: ${conductor.estado}). Solo conductores ACTIVOS pueden registrar desplazamientos.` });
    }

    if (vehiculo.estado !== "ACTIVO") {
      return res.status(400).json({ error: `El vehículo ${vehiculo.placa} no está disponible (estado: ${vehiculo.estado}). Solo vehículos ACTIVOS pueden usarse.` });
    }

    // Verificar que el conductor no tenga un viaje activo (sin fecha de llegada)
    const viajeActivo = await prisma.desplazamiento.findFirst({
      where: { conductorId, fechaLlegada: null },
    });
    if (viajeActivo) {
      return res.status(400).json({ error: "El conductor ya tiene un desplazamiento activo sin fecha de llegada registrada. Cierre el viaje anterior antes de iniciar uno nuevo." });
    }

    // Verificar que el vehículo no esté en otro viaje activo
    const vehiculoEnViaje = await prisma.desplazamiento.findFirst({
      where: { vehiculoId, fechaLlegada: null },
    });
    if (vehiculoEnViaje) {
      return res.status(400).json({ error: `El vehículo ${vehiculo.placa} ya está en un desplazamiento activo. Registre la llegada antes de iniciar uno nuevo.` });
    }

    const desplazamiento = await prisma.desplazamiento.create({
      data: {
        conductorId,
        vehiculoId,
        origen,
        destino,
        fechaSalida: salida,
        fechaLlegada: llegada,
        distanciaKm: distanciaKm ? parseFloat(distanciaKm) : null,
        observaciones,
      },
    });
    res.status(201).json(desplazamiento);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fechaSalida) data.fechaSalida = new Date(data.fechaSalida);
    if (data.fechaLlegada) data.fechaLlegada = new Date(data.fechaLlegada);
    if (data.distanciaKm) data.distanciaKm = parseFloat(data.distanciaKm);

    if (data.fechaSalida && data.fechaLlegada && data.fechaLlegada <= data.fechaSalida) {
      return res.status(400).json({ error: "La fecha de llegada debe ser posterior a la fecha de salida." });
    }

    const desplazamiento = await prisma.desplazamiento.update({ where: { id: req.params.id }, data });
    res.json(desplazamiento);
  } catch (err) { next(err); }
};

const estadisticas = async (req, res, next) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const [todos, delMes] = await Promise.all([
      prisma.desplazamiento.findMany({
        select: { distanciaKm: true, conductorId: true, conductor: { include: { usuario: { select: { nombre: true } } } } },
      }),
      prisma.desplazamiento.count({ where: { fechaSalida: { gte: inicioMes } } }),
    ]);

    const totalKm = todos.reduce((sum, d) => sum + (d.distanciaKm || 0), 0);
    const totalViajes = todos.length;
    const promedioKm = totalViajes > 0 ? totalKm / totalViajes : 0;

    // Agrupar viajes por conductor
    const porConductor = {};
    todos.forEach((d) => {
      const nombre = d.conductor?.usuario?.nombre || "Desconocido";
      if (!porConductor[nombre]) porConductor[nombre] = { nombre, viajes: 0, km: 0 };
      porConductor[nombre].viajes += 1;
      porConductor[nombre].km += d.distanciaKm || 0;
    });

    const topConductores = Object.values(porConductor)
      .sort((a, b) => b.viajes - a.viajes)
      .slice(0, 5)
      .map((c) => ({ ...c, km: parseFloat(c.km.toFixed(1)) }));

    res.json({
      totalKm: parseFloat(totalKm.toFixed(1)),
      totalViajes,
      promedioKmPorViaje: parseFloat(promedioKm.toFixed(1)),
      viajesEsteMes: delMes,
      topConductores,
    });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar, estadisticas };
