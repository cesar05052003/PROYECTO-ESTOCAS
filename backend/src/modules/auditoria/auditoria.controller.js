const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const auditorias = await prisma.auditoria.findMany({ orderBy: { fechaInicio: "desc" } });
    const parsed = auditorias.map(a => ({ ...a, noConformidades: JSON.parse(a.noConformidades || "[]") }));
    res.json(parsed);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { anio, tipo, fechaInicio, fechaFin, auditor, hallazgos, noConformidades, recomendaciones } = req.body;
    const auditoria = await prisma.auditoria.create({
      data: { anio, tipo, fechaInicio: new Date(fechaInicio), fechaFin: new Date(fechaFin), auditor, hallazgos, noConformidades: JSON.stringify(noConformidades || []), recomendaciones },
    });
    res.status(201).json({ ...auditoria, noConformidades: JSON.parse(auditoria.noConformidades) });
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fechaInicio) data.fechaInicio = new Date(data.fechaInicio);
    if (data.fechaFin) data.fechaFin = new Date(data.fechaFin);
    if (data.noConformidades) data.noConformidades = JSON.stringify(data.noConformidades);
    const auditoria = await prisma.auditoria.update({ where: { id: req.params.id }, data });
    res.json({ ...auditoria, noConformidades: JSON.parse(auditoria.noConformidades) });
  } catch (err) { next(err); }
};

const informe = async (req, res, next) => {
  try {
    const auditoria = await prisma.auditoria.findUnique({ where: { id: req.params.id } });
    if (!auditoria) return res.status(404).json({ error: "No encontrado" });
    res.json({ ...auditoria, noConformidades: JSON.parse(auditoria.noConformidades || "[]") });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar, informe };
