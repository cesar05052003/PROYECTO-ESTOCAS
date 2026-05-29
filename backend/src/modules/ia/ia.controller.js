const prisma = require("../../config/db");
const iaService = require("./ia.service");

const generarDocumento = async (req, res, next) => {
  try {
    const { tipo, contexto } = req.body;
    if (!tipo) return res.status(400).json({ error: "El tipo de documento es requerido" });
    const contenido = await iaService.generarDocumento(tipo, contexto || "");
    res.json({ contenido, tipo });
  } catch (err) {
    next(err);
  }
};

const consultaNormativa = async (req, res, next) => {
  try {
    const { historial } = req.body;
    if (!historial || !Array.isArray(historial)) {
      return res.status(400).json({ error: "Historial de conversación requerido" });
    }
    const respuesta = await iaService.consultaNormativa(historial);
    res.json({ respuesta });
  } catch (err) {
    next(err);
  }
};

const investigarIncidente = async (req, res, next) => {
  try {
    const incidente = await prisma.incidente.findUnique({
      where: { id: req.params.incidenteId },
      include: {
        conductor: { include: { usuario: { select: { nombre: true } } } },
        vehiculo: { select: { placa: true, marca: true, modelo: true } },
      },
    });
    if (!incidente) return res.status(404).json({ error: "Incidente no encontrado" });

    const investigacion = await iaService.investigarIncidente(incidente);

    await prisma.incidente.update({
      where: { id: incidente.id },
      data: { investigacion, estado: "EN_INVESTIGACION" },
    });

    res.json({ investigacion });
  } catch (err) {
    next(err);
  }
};

const generarInformeEjecutivo = async (req, res, next) => {
  try {
    const { contexto } = req.body;
    const [kpisData, incidentesMes] = await Promise.all([
      prisma.incidente.count({ where: { fecha: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
      prisma.documento.count({ where: { estado: "APROBADO" } }),
    ]);
    const ctx = `Datos actuales del sistema: ${incidentesMes} incidentes este mes, ${kpisData} documentos aprobados. ${contexto || ""}`;
    const contenido = await iaService.generarInformeEjecutivo(ctx);
    res.json({ contenido });
  } catch (err) {
    next(err);
  }
};

module.exports = { generarDocumento, consultaNormativa, investigarIncidente, generarInformeEjecutivo };
