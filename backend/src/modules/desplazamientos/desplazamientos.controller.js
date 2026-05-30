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
    const desplazamiento = await prisma.desplazamiento.create({
      data: { conductorId, vehiculoId, origen, destino, fechaSalida: new Date(fechaSalida), fechaLlegada: fechaLlegada ? new Date(fechaLlegada) : null, distanciaKm, observaciones },
    });
    res.status(201).json(desplazamiento);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fechaSalida) data.fechaSalida = new Date(data.fechaSalida);
    if (data.fechaLlegada) data.fechaLlegada = new Date(data.fechaLlegada);
    const desplazamiento = await prisma.desplazamiento.update({ where: { id: req.params.id }, data });
    res.json(desplazamiento);
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar };
