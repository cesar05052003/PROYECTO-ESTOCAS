const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const planes = await prisma.planAnualTrabajo.findMany({ orderBy: { anio: "desc" } });
    const parsed = planes.map(p => ({ ...p, actividades: JSON.parse(p.actividades || "[]") }));
    res.json(parsed);
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const plan = await prisma.planAnualTrabajo.findFirst({ where: { anio: parseInt(req.params.anio) } });
    if (!plan) return res.status(404).json({ error: "No encontrado" });
    res.json({ ...plan, actividades: JSON.parse(plan.actividades || "[]") });
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { anio, objetivos, actividades } = req.body;
    const plan = await prisma.planAnualTrabajo.create({
      data: { anio, objetivos, actividades: JSON.stringify(actividades || []) },
    });
    res.status(201).json({ ...plan, actividades: JSON.parse(plan.actividades) });
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.actividades) data.actividades = JSON.stringify(data.actividades);
    const plan = await prisma.planAnualTrabajo.update({ where: { id: req.params.id }, data });
    res.json({ ...plan, actividades: JSON.parse(plan.actividades) });
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, crear, actualizar };
