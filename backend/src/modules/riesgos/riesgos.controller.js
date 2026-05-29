const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const { categoria, estado, page = 1 } = req.query;
    const PAGE_SIZE = 20;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const where = {};
    if (categoria) where.categoria = categoria;
    if (estado) where.estado = estado;

    const [riesgos, total] = await Promise.all([
      prisma.riesgo.findMany({ where, skip, take: PAGE_SIZE, orderBy: { nivelRiesgo: "desc" } }),
      prisma.riesgo.count({ where }),
    ]);
    res.json({ data: riesgos, total, page: parseInt(page) });
  } catch (err) {
    next(err);
  }
};

const matriz = async (req, res, next) => {
  try {
    const riesgos = await prisma.riesgo.findMany({ orderBy: { nivelRiesgo: "desc" } });
    // Agrupar por celda probabilidad-impacto
    const cells = {};
    for (let p = 1; p <= 5; p++) {
      for (let i = 1; i <= 5; i++) {
        const key = `${p}-${i}`;
        cells[key] = { probabilidad: p, impacto: i, nivel: p * i, riesgos: [] };
      }
    }
    riesgos.forEach((r) => {
      const key = `${r.probabilidad}-${r.impacto}`;
      if (cells[key]) cells[key].riesgos.push(r);
    });
    res.json(Object.values(cells));
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion, categoria, fuente, probabilidad, impacto, controlExistente, responsable, estado, pasoPESV } = req.body;
    const p = parseInt(probabilidad);
    const i = parseInt(impacto);
    const riesgo = await prisma.riesgo.create({
      data: {
        nombre, descripcion, categoria, fuente: fuente || null,
        probabilidad: p, impacto: i, nivelRiesgo: p * i,
        controlExistente: controlExistente || null,
        responsable: responsable || null,
        estado: estado || "IDENTIFICADO",
        pasoPESV: pasoPESV || null,
      },
    });
    res.status(201).json(riesgo);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { nombre, descripcion, categoria, fuente, probabilidad, impacto, controlExistente, responsable, estado, pasoPESV } = req.body;
    const p = probabilidad ? parseInt(probabilidad) : undefined;
    const i = impacto ? parseInt(impacto) : undefined;
    const riesgo = await prisma.riesgo.update({
      where: { id: req.params.id },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(categoria && { categoria }),
        ...(fuente !== undefined && { fuente }),
        ...(p && { probabilidad: p }),
        ...(i && { impacto: i }),
        ...(p && i && { nivelRiesgo: p * i }),
        ...(controlExistente !== undefined && { controlExistente }),
        ...(responsable !== undefined && { responsable }),
        ...(estado && { estado }),
        ...(pasoPESV !== undefined && { pasoPESV }),
      },
    });
    res.json(riesgo);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, matriz, crear, actualizar };
