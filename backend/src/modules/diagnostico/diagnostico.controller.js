const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const diagnosticos = await prisma.diagnostico.findMany({
      orderBy: { anio: "desc" },
      include: { riesgos: { select: { id: true, nombre: true, nivelRiesgo: true, estado: true } } },
    });
    res.json(diagnosticos);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { anio, descripcion, hallazgos, conclusiones } = req.body;
    const diagnostico = await prisma.diagnostico.create({
      data: { anio, descripcion, hallazgos, conclusiones },
    });
    res.status(201).json(diagnostico);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const diagnostico = await prisma.diagnostico.findUnique({
      where: { id: req.params.id },
      include: { riesgos: true },
    });
    if (!diagnostico) return res.status(404).json({ error: "No encontrado" });
    res.json(diagnostico);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const diagnostico = await prisma.diagnostico.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(diagnostico);
  } catch (err) { next(err); }
};

module.exports = { listar, crear, obtener, actualizar };
