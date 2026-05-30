const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const { vehiculoId } = req.query;
    const where = vehiculoId ? { vehiculoId } : {};
    const mantenimientos = await prisma.mantenimiento.findMany({
      where,
      orderBy: { fecha: "desc" },
      include: { vehiculo: { select: { placa: true, marca: true, modelo: true } } },
    });
    res.json(mantenimientos);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { vehiculoId, tipo, descripcion, costo, fecha, proximaRevision, taller } = req.body;
    const mantenimiento = await prisma.mantenimiento.create({
      data: { vehiculoId, tipo, descripcion, costo, fecha: new Date(fecha), proximaRevision: proximaRevision ? new Date(proximaRevision) : null, taller },
    });
    res.status(201).json(mantenimiento);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fecha) data.fecha = new Date(data.fecha);
    if (data.proximaRevision) data.proximaRevision = new Date(data.proximaRevision);
    const mantenimiento = await prisma.mantenimiento.update({ where: { id: req.params.id }, data });
    res.json(mantenimiento);
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar };
