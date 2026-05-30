const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        conductores: {
          where: { activo: true },
          include: { conductor: { include: { usuario: { select: { nombre: true } } } } },
        },
      },
    });
    res.json(vehiculos);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: req.params.id },
      include: {
        conductores: { include: { conductor: { include: { usuario: { select: { nombre: true } } } } } },
        mantenimientos: { orderBy: { fecha: "desc" } },
        inspecciones: { orderBy: { fecha: "desc" } },
        incidentes: { orderBy: { fecha: "desc" }, take: 5 },
      },
    });
    if (!vehiculo) return res.status(404).json({ error: "No encontrado" });
    res.json(vehiculo);
  } catch (err) { next(err); }
};

const alertas = async (req, res, next) => {
  try {
    const hoy = new Date();
    const en30dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        OR: [
          { soatVencimiento: { lte: en30dias } },
          { tecnomecanicaVencimiento: { lte: en30dias } },
        ],
      },
      orderBy: { soatVencimiento: "asc" },
    });
    res.json(vehiculos);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { placa, marca, modelo, anio, tipo, kilometraje, soatVencimiento, tecnomecanicaVencimiento, estado } = req.body;
    const vehiculo = await prisma.vehiculo.create({
      data: { placa, marca, modelo, anio, tipo, kilometraje: kilometraje || 0, soatVencimiento: new Date(soatVencimiento), tecnomecanicaVencimiento: new Date(tecnomecanicaVencimiento), estado: estado || "ACTIVO" },
    });
    res.status(201).json(vehiculo);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.soatVencimiento) data.soatVencimiento = new Date(data.soatVencimiento);
    if (data.tecnomecanicaVencimiento) data.tecnomecanicaVencimiento = new Date(data.tecnomecanicaVencimiento);
    const vehiculo = await prisma.vehiculo.update({ where: { id: req.params.id }, data });
    res.json(vehiculo);
  } catch (err) { next(err); }
};

const crearInspeccion = async (req, res, next) => {
  try {
    const { fecha, tipo, resultado, observaciones, realizadoPor } = req.body;
    const inspeccion = await prisma.inspeccionVehiculo.create({
      data: { vehiculoId: req.params.id, fecha: new Date(fecha), tipo, resultado, observaciones, realizadoPor },
    });
    res.status(201).json(inspeccion);
  } catch (err) { next(err); }
};

const listarInspecciones = async (req, res, next) => {
  try {
    const inspecciones = await prisma.inspeccionVehiculo.findMany({
      where: { vehiculoId: req.params.id },
      orderBy: { fecha: "desc" },
    });
    res.json(inspecciones);
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, alertas, crear, actualizar, crearInspeccion, listarInspecciones };
