const prisma = require("../../config/db");

const listar = async (req, res, next) => {
  try {
    const capacitaciones = await prisma.capacitacion.findMany({
      where: { activo: true },
      include: {
        _count: { select: { participantes: true } },
        participantes: { select: { aprobado: true, completadoEn: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const data = capacitaciones.map((c) => ({
      ...c,
      totalParticipantes: c._count.participantes,
      completados: c.participantes.filter((p) => p.aprobado).length,
    }));
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const participantes = async (req, res, next) => {
  try {
    const lista = await prisma.usuarioCapacitacion.findMany({
      where: { capacitacionId: req.params.id },
      include: {
        usuario: { select: { nombre: true, email: true } },
        conductor: { select: { cedula: true, licenciaCategoria: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(lista);
  } catch (err) {
    next(err);
  }
};

const inscribir = async (req, res, next) => {
  try {
    const { usuarioId, conductorId } = req.body;
    const existente = await prisma.usuarioCapacitacion.findFirst({
      where: { usuarioId, capacitacionId: req.params.id },
    });
    if (existente) return res.status(409).json({ error: "El conductor ya está inscrito" });
    const ins = await prisma.usuarioCapacitacion.create({
      data: { usuarioId, conductorId: conductorId || null, capacitacionId: req.params.id },
    });
    res.status(201).json(ins);
  } catch (err) {
    next(err);
  }
};

const evaluar = async (req, res, next) => {
  try {
    const { usuarioCapacitacionId, puntaje } = req.body;
    const aprobado = puntaje >= 70;
    const resultado = await prisma.usuarioCapacitacion.update({
      where: { id: usuarioCapacitacionId },
      data: { puntaje: parseFloat(puntaje), aprobado, completadoEn: new Date() },
    });
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const { titulo, descripcion, contenido, duracion, categoria, obligatoria } = req.body;
    const cap = await prisma.capacitacion.create({
      data: { titulo, descripcion, contenido, duracion: parseInt(duracion), categoria, obligatoria: obligatoria !== false },
    });
    res.status(201).json(cap);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, participantes, inscribir, evaluar, crear };
