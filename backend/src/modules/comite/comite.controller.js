const prisma = require("../../config/db");

const obtenerComite = async (req, res, next) => {
  try {
    const comite = await prisma.comiteSeguridadVial.findFirst({
      include: { miembros: true, reuniones: { orderBy: { fecha: "desc" } } },
    });
    res.json(comite);
  } catch (err) { next(err); }
};

const crearComite = async (req, res, next) => {
  try {
    const { nombre, fechaCreacion, acta } = req.body;
    const comite = await prisma.comiteSeguridadVial.create({
      data: { nombre, fechaCreacion: new Date(fechaCreacion), acta },
    });
    res.status(201).json(comite);
  } catch (err) { next(err); }
};

const agregarMiembro = async (req, res, next) => {
  try {
    const { comiteId, nombre, cargo, esLider } = req.body;
    const miembro = await prisma.miembroComite.create({
      data: { comiteId, nombre, cargo, esLider: esLider || false },
    });
    res.status(201).json(miembro);
  } catch (err) { next(err); }
};

const eliminarMiembro = async (req, res, next) => {
  try {
    await prisma.miembroComite.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
};

const crearReunion = async (req, res, next) => {
  try {
    const { comiteId, fecha, tema, acta } = req.body;
    const reunion = await prisma.reunionComite.create({
      data: { comiteId, fecha: new Date(fecha), tema, acta },
    });
    res.status(201).json(reunion);
  } catch (err) { next(err); }
};

const listarReuniones = async (req, res, next) => {
  try {
    const reuniones = await prisma.reunionComite.findMany({
      orderBy: { fecha: "desc" },
      include: { comite: { select: { nombre: true } } },
    });
    res.json(reuniones);
  } catch (err) { next(err); }
};

module.exports = { obtenerComite, crearComite, agregarMiembro, eliminarMiembro, crearReunion, listarReuniones };
