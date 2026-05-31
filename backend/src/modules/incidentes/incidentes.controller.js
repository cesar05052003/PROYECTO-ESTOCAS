const prisma = require("../../config/db");

const PAGE_SIZE = 10;

const listar = async (req, res, next) => {
  try {
    const { tipo, estado, severidad, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const where = {};
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;
    if (severidad) where.severidad = severidad;

    const [incidentes, total] = await Promise.all([
      prisma.incidente.findMany({
        where, skip, take: PAGE_SIZE,
        include: {
          conductor: { include: { usuario: { select: { nombre: true } } } },
          vehiculo: { select: { placa: true, marca: true, modelo: true } },
          usuario: { select: { nombre: true } },
        },
        orderBy: { fecha: "desc" },
      }),
      prisma.incidente.count({ where }),
    ]);
    res.json({ data: incidentes, total, page: parseInt(page), pages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    next(err);
  }
};

const estadisticas = async (req, res, next) => {
  try {
    const hoy = new Date();
    const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const hace6meses = new Date();
    hace6meses.setMonth(hace6meses.getMonth() - 6);

    const [incidentesMes, todos, ultimoAccidente] = await Promise.all([
      prisma.incidente.count({ where: { fecha: { gte: inicioMes } } }),
      prisma.incidente.findMany({
        where: { fecha: { gte: hace6meses } },
        select: { tipo: true, fecha: true },
        orderBy: { fecha: "asc" },
      }),
      prisma.incidente.findFirst({
        where: { tipo: { startsWith: "ACCIDENTE" } },
        orderBy: { fecha: "desc" },
        select: { fecha: true },
      }),
    ]);

    // Agrupar por mes en JS
    const mesNombres = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const mesesMap = {};
    todos.forEach((inc) => {
      const d = new Date(inc.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!mesesMap[key]) mesesMap[key] = { mes: mesNombres[d.getMonth()], accidentes: 0, casi_accidentes: 0, total: 0 };
      if (inc.tipo.startsWith("ACCIDENTE")) mesesMap[key].accidentes++;
      else if (inc.tipo === "CASI_ACCIDENTE") mesesMap[key].casi_accidentes++;
      mesesMap[key].total++;
    });

    // Contar por tipo
    const tiposMap = {};
    todos.forEach((inc) => {
      if (!tiposMap[inc.tipo]) tiposMap[inc.tipo] = 0;
      tiposMap[inc.tipo]++;
    });
    const porTipo = Object.entries(tiposMap).map(([tipo, count]) => ({ tipo, _count: { id: count } }));

    const totalAnio = await prisma.incidente.count({ where: { fecha: { gte: inicioAnio } } });

    const diasSinAccidente = ultimoAccidente
      ? Math.floor((hoy - new Date(ultimoAccidente.fecha)) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      totalMes: incidentesMes,
      totalAnio,
      porTipo,
      porMes: Object.values(mesesMap),
      diasSinAccidente,
    });
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const { tipo, descripcion, fecha, lugar, municipio, vehiculoId, conductorId, lesionados, muertos, costoEstimado, severidad } = req.body;
    const incidente = await prisma.incidente.create({
      data: {
        tipo, descripcion, fecha: new Date(fecha), lugar,
        municipio: municipio || null,
        vehiculoId: vehiculoId || null,
        conductorId: conductorId || null,
        reportadoPor: req.user.id,
        lesionados: parseInt(lesionados) || 0,
        muertos: parseInt(muertos) || 0,
        costoEstimado: costoEstimado ? parseFloat(costoEstimado) : null,
        severidad: severidad || "MODERADO",
      },
    });
    res.status(201).json(incidente);
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { tipo, descripcion, fecha, lugar, municipio, estado, severidad, investigacion, lesionados, muertos, costoEstimado } = req.body;

    const actual = await prisma.incidente.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { accionesCorrectivas: true } } },
    });
    if (!actual) return res.status(404).json({ error: "Incidente no encontrado" });

    if (estado === "CERRADO") {
      const textoInvestigacion = investigacion ?? actual.investigacion;
      if (!textoInvestigacion || textoInvestigacion.trim().length < 10) {
        return res.status(400).json({
          error: "No se puede cerrar el incidente sin una investigación documentada. Usa el botón de IA para generarla.",
        });
      }
      if (actual._count.accionesCorrectivas === 0) {
        return res.status(400).json({
          error: "No se puede cerrar el incidente sin al menos una acción correctiva registrada.",
        });
      }
    }

    // Si se agrega investigación y el incidente sigue REPORTADO → avanzar automáticamente
    const nuevoEstado = estado ?? (
      investigacion && actual.estado === "REPORTADO" ? "EN_INVESTIGACION" : undefined
    );

    const incidente = await prisma.incidente.update({
      where: { id: req.params.id },
      data: {
        ...(tipo && { tipo }),
        ...(descripcion && { descripcion }),
        ...(fecha && { fecha: new Date(fecha) }),
        ...(lugar && { lugar }),
        ...(municipio !== undefined && { municipio }),
        ...(nuevoEstado && { estado: nuevoEstado }),
        ...(severidad && { severidad }),
        ...(investigacion !== undefined && { investigacion }),
        ...(lesionados !== undefined && { lesionados: parseInt(lesionados) }),
        ...(muertos !== undefined && { muertos: parseInt(muertos) }),
        ...(costoEstimado !== undefined && { costoEstimado: costoEstimado ? parseFloat(costoEstimado) : null }),
      },
    });
    res.json(incidente);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, estadisticas, crear, actualizar };
