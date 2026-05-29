const prisma = require("../../config/db");

const PAGE_SIZE = 10;

const listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * PAGE_SIZE;

    const [conductores, total] = await Promise.all([
      prisma.conductor.findMany({
        skip,
        take: PAGE_SIZE,
        include: {
          usuario: { select: { nombre: true, email: true } },
          vehiculo: { select: { placa: true, marca: true, modelo: true } },
          _count: { select: { incidentes: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.conductor.count(),
    ]);

    const hoy = new Date();
    const data = conductores.map((c) => {
      const diasLicencia = Math.ceil((new Date(c.licenciaVencimiento) - hoy) / (1000 * 60 * 60 * 24));
      return {
        ...c,
        alertaLicencia: diasLicencia <= 0 ? "VENCIDA" : diasLicencia <= 15 ? "CRITICA" : diasLicencia <= 30 ? "PROXIMA" : null,
        diasLicencia,
      };
    });

    res.json({ data, total, page, pages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const conductor = await prisma.conductor.findUnique({
      where: { id: req.params.id },
      include: {
        usuario: { select: { nombre: true, email: true } },
        vehiculo: true,
        incidentes: { orderBy: { fecha: "desc" }, take: 10 },
        capacitaciones: {
          include: { capacitacion: { select: { titulo: true, categoria: true } } },
        },
      },
    });
    if (!conductor) return res.status(404).json({ error: "Conductor no encontrado" });
    res.json(conductor);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const { cedula, telefono, licenciaCategoria, licenciaVencimiento, estado, vehiculoId, usuarioId } = req.body;
    const conductor = await prisma.conductor.create({
      data: { cedula, telefono, licenciaCategoria, licenciaVencimiento: new Date(licenciaVencimiento), estado: estado || "activo", vehiculoId: vehiculoId || null, usuarioId },
      include: { usuario: { select: { nombre: true, email: true } } },
    });
    res.status(201).json(conductor);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { cedula, telefono, licenciaCategoria, licenciaVencimiento, estado, vehiculoId } = req.body;
    const conductor = await prisma.conductor.update({
      where: { id: req.params.id },
      data: {
        ...(cedula && { cedula }),
        ...(telefono && { telefono }),
        ...(licenciaCategoria && { licenciaCategoria }),
        ...(licenciaVencimiento && { licenciaVencimiento: new Date(licenciaVencimiento) }),
        ...(estado && { estado }),
        vehiculoId: vehiculoId ?? undefined,
      },
      include: { usuario: { select: { nombre: true, email: true } } },
    });
    res.json(conductor);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obtener, crear, actualizar };
