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

const misCapacitaciones = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const capacitaciones = await prisma.usuarioCapacitacion.findMany({
      where: { usuarioId: userId, capacitacion: { activo: true } },
      include: { capacitacion: { include: { preguntas: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(capacitaciones);
  } catch (err) {
    next(err);
  }
};

const obtenerCapacitacion = async (req, res, next) => {
  try {
    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id: req.params.id },
      include: { preguntas: true },
    });
    if (!capacitacion) return res.status(404).json({ error: "Capacitación no encontrada" });
    res.json(capacitacion);
  } catch (err) {
    next(err);
  }
};

const enviarRespuestas = async (req, res, next) => {
  try {
    const { usuarioCapacitacionId, respuestas } = req.body;
    const usuarioCapacitacion = await prisma.usuarioCapacitacion.findUnique({
      where: { id: usuarioCapacitacionId },
      include: { capacitacion: { include: { preguntas: true } } },
    });

    if (!usuarioCapacitacion) return res.status(404).json({ error: "Inscripción no encontrada" });

    let correctas = 0;
    const preguntas = usuarioCapacitacion.capacitacion.preguntas;
    
    preguntas.forEach((pregunta) => {
      const respuestaUsuario = respuestas[pregunta.id];
      if (respuestaUsuario === pregunta.respuestaCorrecta) {
        correctas++;
      }
    });

    const puntaje = preguntas.length > 0 ? (correctas / preguntas.length) * 100 : 0;
    const aprobado = puntaje >= 70;

    const resultado = await prisma.usuarioCapacitacion.update({
      where: { id: usuarioCapacitacionId },
      data: {
        puntaje,
        aprobado,
        completadoEn: new Date(),
        intentos: usuarioCapacitacion.intentos + 1,
      },
    });

    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const agregarPregunta = async (req, res, next) => {
  try {
    const { capacitacionId, enunciado, opciones, respuestaCorrecta } = req.body;
    const pregunta = await prisma.pregunta.create({
      data: {
        capacitacionId,
        enunciado,
        opciones: JSON.stringify(opciones),
        respuestaCorrecta: parseInt(respuestaCorrecta),
      },
    });
    res.status(201).json(pregunta);
  } catch (err) {
    next(err);
  }
};

const generarCertificado = async (req, res, next) => {
  try {
    const { usuarioCapacitacionId } = req.params;
    const usuarioCapacitacion = await prisma.usuarioCapacitacion.findUnique({
      where: { id: usuarioCapacitacionId },
      include: {
        usuario: true,
        capacitacion: true,
      },
    });

    if (!usuarioCapacitacion) return res.status(404).json({ error: "Inscripción no encontrada" });
    if (!usuarioCapacitacion.aprobado) return res.status(400).json({ error: "El usuario no ha aprobado la capacitación" });

    const certificadoUrl = `https://certificados.pesv-digital.com/${usuarioCapacitacion.id}.pdf`;
    
    const actualizado = await prisma.usuarioCapacitacion.update({
      where: { id: usuarioCapacitacionId },
      data: { certificadoUrl },
    });

    res.json({ certificadoUrl, usuarioCapacitacion: actualizado });
  } catch (err) {
    next(err);
  }
};

const eliminarCapacitacion = async (req, res, next) => {
  try {
    await prisma.capacitacion.update({
      where: { id: req.params.id },
      data: { activo: false },
    });
    res.json({ message: "Capacitación eliminada" });
  } catch (err) {
    next(err);
  }
};

const registrarAsistencia = async (req, res, next) => {
  try {
    const { usuarioId, asistio, observaciones } = req.body;
    const asistencia = await prisma.asistenciaCapacitacion.create({
      data: {
        capacitacionId: req.params.id,
        usuarioId,
        asistio: asistio !== false,
        observaciones: observaciones || null,
        registradoPor: req.user.id,
      },
      include: { usuario: { select: { nombre: true, email: true } } },
    });
    res.status(201).json(asistencia);
  } catch (err) { next(err); }
};

const listarAsistencia = async (req, res, next) => {
  try {
    const lista = await prisma.asistenciaCapacitacion.findMany({
      where: { capacitacionId: req.params.id },
      include: { usuario: { select: { nombre: true, email: true } } },
      orderBy: { fecha: "desc" },
    });
    res.json(lista);
  } catch (err) { next(err); }
};

module.exports = {
  listar,
  participantes,
  inscribir,
  evaluar,
  crear,
  misCapacitaciones,
  obtenerCapacitacion,
  enviarRespuestas,
  agregarPregunta,
  generarCertificado,
  eliminarCapacitacion,
  registrarAsistencia,
  listarAsistencia,
};
