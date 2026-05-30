const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const conductores = await prisma.conductor.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        usuario: { select: { nombre: true, email: true, rol: true } },
        vehiculosAsignados: {
          where: { activo: true },
          include: { vehiculo: { select: { placa: true, marca: true, modelo: true } } },
        },
      },
    });
    res.json(conductores);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const conductor = await prisma.conductor.findUnique({
      where: { id: req.params.id },
      include: {
        usuario: { select: { nombre: true, email: true, rol: true } },
        vehiculosAsignados: { include: { vehiculo: true } },
        incidentes: { orderBy: { fecha: "desc" }, take: 10 },
        capacitaciones: { include: { capacitacion: { select: { titulo: true, categoria: true } } } },
        desplazamientos: { orderBy: { fechaSalida: "desc" }, take: 10 },
      },
    });
    if (!conductor) return res.status(404).json({ error: "Conductor no encontrado" });
    res.json(conductor);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { usuarioId, cedula, telefono, fechaNacimiento, licenciaCategoria, licenciaVencimiento, nivelEducacion, experienciaAnios, vehiculoId } = req.body;
    const conductor = await prisma.conductor.create({
      data: {
        usuarioId, cedula, telefono,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        licenciaCategoria, licenciaVencimiento: new Date(licenciaVencimiento),
        nivelEducacion, experienciaAnios,
      },
    });
    if (vehiculoId) {
      await prisma.vehiculoConductor.create({ data: { vehiculoId, conductorId: conductor.id } });
    }
    res.status(201).json(conductor);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.licenciaVencimiento) data.licenciaVencimiento = new Date(data.licenciaVencimiento);
    if (data.fechaNacimiento) data.fechaNacimiento = new Date(data.fechaNacimiento);
    delete data.vehiculoId;
    const conductor = await prisma.conductor.update({ where: { id: req.params.id }, data });
    res.json(conductor);
  } catch (err) { next(err); }
};

const historial = async (req, res, next) => {
  try {
    const [incidentes, capacitaciones, desplazamientos] = await Promise.all([
      prisma.incidente.findMany({ where: { conductorId: req.params.id }, orderBy: { fecha: "desc" } }),
      prisma.usuarioCapacitacion.findMany({
        where: { conductorId: req.params.id },
        include: { capacitacion: { select: { titulo: true, categoria: true } } },
      }),
      prisma.desplazamiento.findMany({ where: { conductorId: req.params.id }, orderBy: { fechaSalida: "desc" }, take: 20 }),
    ]);
    res.json({ incidentes, capacitaciones, desplazamientos });
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, crear, actualizar, historial };
