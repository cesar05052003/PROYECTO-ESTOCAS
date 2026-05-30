const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const planes = await prisma.planEmergencia.findMany({ orderBy: { createdAt: "desc" } });
    const parsed = planes.map(p => ({ ...p, contactosEmergencia: JSON.parse(p.contactosEmergencia || "[]") }));
    res.json(parsed);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { titulo, descripcion, procedimientos, contactosEmergencia } = req.body;
    const plan = await prisma.planEmergencia.create({
      data: { titulo, descripcion, procedimientos, contactosEmergencia: JSON.stringify(contactosEmergencia || []) },
    });
    res.status(201).json({ ...plan, contactosEmergencia: JSON.parse(plan.contactosEmergencia) });
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.contactosEmergencia) data.contactosEmergencia = JSON.stringify(data.contactosEmergencia);
    const plan = await prisma.planEmergencia.update({ where: { id: req.params.id }, data });
    res.json({ ...plan, contactosEmergencia: JSON.parse(plan.contactosEmergencia) });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar };
