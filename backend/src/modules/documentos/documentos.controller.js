const prisma = require("../../config/db");

const PAGE_SIZE = 10;

const listar = async (req, res, next) => {
  try {
    const { categoria, estado, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const where = {};
    if (categoria && categoria !== "Todos") where.categoria = categoria;
    if (estado) where.estado = estado;

    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        include: { usuario: { select: { nombre: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.documento.count({ where }),
    ]);
    res.json({ data: documentos, total, page: parseInt(page), pages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const doc = await prisma.documento.findUnique({
      where: { id: req.params.id },
      include: { usuario: { select: { nombre: true } } },
    });
    if (!doc) return res.status(404).json({ error: "Documento no encontrado" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const { titulo, categoria, version, contenido, estado, generadoIA, pasoResolucion } = req.body;
    const doc = await prisma.documento.create({
      data: {
        titulo, categoria, contenido,
        version: parseInt(version) || 1,
        estado: estado || "BORRADOR",
        generadoIA: generadoIA || false,
        pasoResolucion: pasoResolucion ? parseInt(pasoResolucion) : null,
        creadoPor: req.user.id,
      },
      include: { usuario: { select: { nombre: true } } },
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { titulo, categoria, version, contenido, estado, pasoResolucion } = req.body;
    const doc = await prisma.documento.update({
      where: { id: req.params.id },
      data: {
        ...(titulo && { titulo }),
        ...(categoria && { categoria }),
        ...(version && { version: parseInt(version) }),
        ...(contenido && { contenido }),
        ...(estado && { estado }),
        ...(pasoResolucion !== undefined && { pasoResolucion: pasoResolucion ? parseInt(pasoResolucion) : null }),
      },
    });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await prisma.documento.delete({ where: { id: req.params.id } });
    res.json({ message: "Documento eliminado" });
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
