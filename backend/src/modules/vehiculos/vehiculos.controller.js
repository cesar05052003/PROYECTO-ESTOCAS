const prisma = require("../../config/db");

const PAGE_SIZE = 10;

const listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * PAGE_SIZE;

    const [vehiculos, total] = await Promise.all([
      prisma.vehiculo.findMany({
        skip,
        take: PAGE_SIZE,
        include: {
          conductores: { include: { usuario: { select: { nombre: true } } } },
          _count: { select: { incidentes: true, mantenimientos: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.vehiculo.count(),
    ]);

    const hoy = new Date();
    const data = vehiculos.map((v) => {
      const diasSoat = Math.ceil((new Date(v.soatVencimiento) - hoy) / (1000 * 60 * 60 * 24));
      const diasTec = Math.ceil((new Date(v.tecnomecanicaVencimiento) - hoy) / (1000 * 60 * 60 * 24));
      return {
        ...v,
        alertaSoat: diasSoat <= 0 ? "VENCIDO" : diasSoat <= 15 ? "CRITICO" : diasSoat <= 30 ? "PROXIMO" : null,
        alertaTec: diasTec <= 0 ? "VENCIDO" : diasTec <= 15 ? "CRITICO" : diasTec <= 30 ? "PROXIMO" : null,
        diasSoat,
        diasTec,
      };
    });

    res.json({ data, total, page, pages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: req.params.id },
      include: {
        conductores: { include: { usuario: { select: { nombre: true } } } },
        mantenimientos: { orderBy: { fecha: "desc" } },
        incidentes: { orderBy: { fecha: "desc" }, take: 10 },
      },
    });
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });
    res.json(vehiculo);
  } catch (err) {
    next(err);
  }
};

const alertas = async (req, res, next) => {
  try {
    const hoy = new Date();
    const limite = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        OR: [
          { soatVencimiento: { lte: limite } },
          { tecnomecanicaVencimiento: { lte: limite } },
        ],
      },
    });
    res.json(vehiculos);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const { placa, marca, modelo, anio, tipo, kilometraje, soatVencimiento, tecnomecanicaVencimiento, estado } = req.body;
    const vehiculo = await prisma.vehiculo.create({
      data: {
        placa, marca, modelo, anio: parseInt(anio), tipo,
        kilometraje: parseInt(kilometraje) || 0,
        soatVencimiento: new Date(soatVencimiento),
        tecnomecanicaVencimiento: new Date(tecnomecanicaVencimiento),
        estado: estado || "operativo",
      },
    });
    res.status(201).json(vehiculo);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { placa, marca, modelo, anio, tipo, kilometraje, soatVencimiento, tecnomecanicaVencimiento, estado } = req.body;
    const vehiculo = await prisma.vehiculo.update({
      where: { id: req.params.id },
      data: {
        ...(placa && { placa }),
        ...(marca && { marca }),
        ...(modelo && { modelo }),
        ...(anio && { anio: parseInt(anio) }),
        ...(tipo && { tipo }),
        ...(kilometraje !== undefined && { kilometraje: parseInt(kilometraje) }),
        ...(soatVencimiento && { soatVencimiento: new Date(soatVencimiento) }),
        ...(tecnomecanicaVencimiento && { tecnomecanicaVencimiento: new Date(tecnomecanicaVencimiento) }),
        ...(estado && { estado }),
      },
    });
    res.json(vehiculo);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obtener, alertas, crear, actualizar };
