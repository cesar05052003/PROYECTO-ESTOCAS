const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const acciones = await prisma.accionCorrectiva.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        incidente: { select: { id: true, tipo: true, descripcion: true, fecha: true } },
        usuario: { select: { nombre: true } },
      },
    });
    res.json(acciones);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { incidenteId, tipo, descripcion, responsable, fechaLimite } = req.body;
    const accion = await prisma.accionCorrectiva.create({
      data: { incidenteId, tipo, descripcion, responsable, usuarioId: req.user.id, fechaLimite: new Date(fechaLimite) },
    });
    res.status(201).json(accion);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fechaLimite) data.fechaLimite = new Date(data.fechaLimite);
    const accion = await prisma.accionCorrectiva.update({ where: { id: req.params.id }, data });
    res.json(accion);
  } catch (err) { next(err); }
};

const cerrar = async (req, res, next) => {
  try {
    const accion = await prisma.accionCorrectiva.update({
      where: { id: req.params.id },
      data: { estado: "CERRADA", evidenciaUrl: req.body.evidenciaUrl },
    });
    res.json(accion);
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar, cerrar };
