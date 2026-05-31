const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos PESV Digital...");

  // Limpiar en orden correcto (nuevos modelos primero)
  await prisma.alerta.deleteMany();
  await prisma.auditoria.deleteMany();
  await prisma.reporteAutogestion.deleteMany();
  await prisma.accionCorrectiva.deleteMany();
  await prisma.desplazamiento.deleteMany();
  await prisma.fotoIncidente.deleteMany();
  await prisma.planEmergencia.deleteMany();
  await prisma.planAnualTrabajo.deleteMany();
  await prisma.programaRiesgoCritico.deleteMany();
  await prisma.versionDocumento.deleteMany();
  await prisma.inspeccionVehiculo.deleteMany();
  await prisma.vehiculoConductor.deleteMany();
  await prisma.reunionComite.deleteMany();
  await prisma.miembroComite.deleteMany();
  await prisma.comiteSeguridadVial.deleteMany();
  await prisma.usuarioCapacitacion.deleteMany();
  await prisma.pregunta.deleteMany();
  await prisma.capacitacion.deleteMany();
  await prisma.incidente.deleteMany();
  await prisma.mantenimiento.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.riesgo.deleteMany();
  await prisma.diagnostico.deleteMany();
  await prisma.conductor.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();

  // ─── USUARIOS ──────────────────────────────────────────
  const hash = (pwd) => bcrypt.hashSync(pwd, 10);

  const admin = await prisma.usuario.create({
    data: { nombre: "Administrador PESV", email: "admin@pesv.co", password: hash("admin123"), rol: "ADMINISTRADOR" },
  });
  const lider = await prisma.usuario.create({
    data: { nombre: "María Rodríguez", email: "lider@pesv.co", password: hash("lider123"), rol: "LIDER" },
  });
  const gerente = await prisma.usuario.create({
    data: { nombre: "Carlos Jiménez", email: "gerente@pesv.co", password: hash("gerente123"), rol: "GERENTE" },
  });
  const miembroComite = await prisma.usuario.create({
    data: { nombre: "Laura Pérez", email: "comite@pesv.co", password: hash("comite123"), rol: "LIDER" },
  });
  const cond1 = await prisma.usuario.create({
    data: { nombre: "Carlos Martínez", email: "c1@pesv.co", password: hash("cond123"), rol: "CONDUCTOR" },
  });
  const cond2 = await prisma.usuario.create({
    data: { nombre: "Pedro Sánchez", email: "c2@pesv.co", password: hash("cond123"), rol: "CONDUCTOR" },
  });
  const cond3 = await prisma.usuario.create({
    data: { nombre: "Luis Herrera", email: "c3@pesv.co", password: hash("cond123"), rol: "CONDUCTOR" },
  });
  const cond4 = await prisma.usuario.create({
    data: { nombre: "Ana González", email: "c4@pesv.co", password: hash("cond123"), rol: "CONDUCTOR" },
  });
  const cond5 = await prisma.usuario.create({
    data: { nombre: "Miguel Torres", email: "c5@pesv.co", password: hash("cond123"), rol: "CONDUCTOR" },
  });

  console.log("✅ Usuarios creados");

  // ─── VEHÍCULOS ──────────────────────────────────────────
  const v1 = await prisma.vehiculo.create({
    data: {
      placa: "ABC-123", marca: "Chevrolet", modelo: "NPR", anio: 2019,
      tipo: "Camión", kilometraje: 145230,
      soatVencimiento: new Date("2025-02-28"),
      tecnomecanicaVencimiento: new Date("2025-06-15"),
      estado: "ACTIVO",
    },
  });
  const v2 = await prisma.vehiculo.create({
    data: {
      placa: "DEF-456", marca: "Toyota", modelo: "Hilux", anio: 2021,
      tipo: "Camioneta", kilometraje: 87430,
      soatVencimiento: new Date("2025-09-10"),
      tecnomecanicaVencimiento: new Date("2025-09-10"),
      estado: "ACTIVO",
    },
  });
  const v3 = await prisma.vehiculo.create({
    data: {
      placa: "GHI-789", marca: "Mercedes", modelo: "OF-1721", anio: 2018,
      tipo: "Bus", kilometraje: 234100,
      soatVencimiento: new Date("2025-01-05"),
      tecnomecanicaVencimiento: new Date("2024-11-20"),
      estado: "EN_MANTENIMIENTO",
    },
  });
  const v4 = await prisma.vehiculo.create({
    data: {
      placa: "JKL-012", marca: "Kenworth", modelo: "T800", anio: 2020,
      tipo: "Camión", kilometraje: 198450,
      soatVencimiento: new Date("2025-07-30"),
      tecnomecanicaVencimiento: new Date("2025-08-15"),
      estado: "ACTIVO",
    },
  });
  const v5 = await prisma.vehiculo.create({
    data: {
      placa: "MNO-345", marca: "Ford", modelo: "Ranger", anio: 2022,
      tipo: "Camioneta", kilometraje: 52100,
      soatVencimiento: new Date("2026-01-20"),
      tecnomecanicaVencimiento: new Date("2026-01-20"),
      estado: "ACTIVO",
    },
  });

  // Mantenimientos
  await prisma.mantenimiento.createMany({
    data: [
      { vehiculoId: v1.id, tipo: "preventivo", descripcion: "Cambio de aceite y filtros", costo: 450000, fecha: new Date("2024-11-10"), taller: "Taller Central Montería", proximaRevision: new Date("2025-05-10") },
      { vehiculoId: v3.id, tipo: "correctivo", descripcion: "Reparación sistema de frenos", costo: 1200000, fecha: new Date("2024-12-05"), taller: "AutoFreno S.A." },
      { vehiculoId: v2.id, tipo: "preventivo", descripcion: "Revisión general 80.000 km", costo: 320000, fecha: new Date("2025-01-15"), taller: "Toyota Authorized Service", proximaRevision: new Date("2025-07-15") },
    ],
  });

  // Inspecciones
  await prisma.inspeccionVehiculo.createMany({
    data: [
      { vehiculoId: v1.id, fecha: new Date("2025-01-15"), tipo: "preoperacional", resultado: "APROBADO", observaciones: "Vehículo en condiciones óptimas", realizadoPor: "Carlos Martínez" },
      { vehiculoId: v2.id, fecha: new Date("2025-01-15"), tipo: "preoperacional", resultado: "APROBADO", observaciones: "Llantas en buen estado", realizadoPor: "Luis Herrera" },
      { vehiculoId: v3.id, fecha: new Date("2025-01-10"), tipo: "periódica", resultado: "RECHAZADO", observaciones: "Sistema de frenos deficiente, requiere mantenimiento correctivo", realizadoPor: "Pedro Sánchez" },
    ],
  });

  console.log("✅ Vehículos, mantenimientos e inspecciones creados");

  // ─── CONDUCTORES ──────────────────────────────────────────
  const conductor1 = await prisma.conductor.create({
    data: {
      usuarioId: cond1.id, cedula: "1045234567", telefono: "3145678901",
      licenciaCategoria: "B2", licenciaVencimiento: new Date("2025-08-15"),
      fechaNacimiento: new Date("1990-03-12"), nivelEducacion: "Bachiller", experienciaAnios: 8,
      estado: "activo",
    },
  });
  const conductor2 = await prisma.conductor.create({
    data: {
      usuarioId: cond2.id, cedula: "1098765432", telefono: "3167890123",
      licenciaCategoria: "C1", licenciaVencimiento: new Date("2024-12-01"),
      fechaNacimiento: new Date("1985-07-22"), nivelEducacion: "Técnico", experienciaAnios: 12,
      estado: "suspendido",
    },
  });
  const conductor3 = await prisma.conductor.create({
    data: {
      usuarioId: cond3.id, cedula: "1056789012", telefono: "3189012345",
      licenciaCategoria: "B2", licenciaVencimiento: new Date("2026-03-20"),
      fechaNacimiento: new Date("1992-11-05"), nivelEducacion: "Bachiller", experienciaAnios: 6,
      estado: "activo",
    },
  });
  const conductor4 = await prisma.conductor.create({
    data: {
      usuarioId: cond4.id, cedula: "1034567890", telefono: "3112345678",
      licenciaCategoria: "B2", licenciaVencimiento: new Date("2025-11-30"),
      fechaNacimiento: new Date("1988-01-18"), nivelEducacion: "Tecnólogo", experienciaAnios: 10,
      estado: "activo",
    },
  });
  const conductor5 = await prisma.conductor.create({
    data: {
      usuarioId: cond5.id, cedula: "1067890123", telefono: "3134567890",
      licenciaCategoria: "C1", licenciaVencimiento: new Date("2025-06-10"),
      fechaNacimiento: new Date("1995-09-30"), nivelEducacion: "Bachiller", experienciaAnios: 4,
      estado: "activo",
    },
  });

  // Asignar vehículos a conductores (tabla pivot)
  await prisma.vehiculoConductor.createMany({
    data: [
      { vehiculoId: v1.id, conductorId: conductor1.id, activo: true },
      { vehiculoId: v3.id, conductorId: conductor2.id, activo: false },
      { vehiculoId: v2.id, conductorId: conductor3.id, activo: true },
      { vehiculoId: v4.id, conductorId: conductor4.id, activo: true },
      { vehiculoId: v5.id, conductorId: conductor5.id, activo: true },
    ],
  });

  console.log("✅ Conductores y asignaciones creados");

  // ─── COMITÉ DE SEGURIDAD VIAL ─────────────────────────────
  const comite = await prisma.comiteSeguridadVial.create({
    data: {
      nombre: "Comité de Seguridad Vial TransCor S.A.S.",
      fechaCreacion: new Date("2024-06-15"),
      acta: "Acta de constitución del Comité de Seguridad Vial conforme al paso 2 de la Resolución 40595 de 2022.",
      miembros: {
        create: [
          { nombre: "María Rodríguez", cargo: "Líder PESV", esLider: true },
          { nombre: "Carlos Jiménez", cargo: "Gerente General", esLider: false },
          { nombre: "Laura Pérez", cargo: "Coordinadora SST", esLider: false },
          { nombre: "Jorge Méndez", cargo: "Jefe de Operaciones", esLider: false },
        ],
      },
      reuniones: {
        create: [
          { fecha: new Date("2024-07-10"), tema: "Aprobación Política de Seguridad Vial", acta: "Se aprueba la política de seguridad vial versión 1.0." },
          { fecha: new Date("2024-10-15"), tema: "Revisión diagnóstico y matriz de riesgos", acta: "Se revisan los hallazgos del diagnóstico inicial y se aprueba la matriz de riesgos." },
          { fecha: new Date("2024-12-20"), tema: "Seguimiento indicadores PESV", acta: "Se presentan los indicadores del trimestre y se definen acciones correctivas." },
        ],
      },
    },
  });
  console.log("✅ Comité de Seguridad Vial creado");

  // ─── DIAGNÓSTICO ──────────────────────────────────────────
  const diagnostico = await prisma.diagnostico.create({
    data: {
      anio: 2024,
      descripcion: "Diagnóstico inicial del PESV de TransCor S.A.S. conforme al paso 5 de la Resolución 40595 de 2022.",
      hallazgos: "1. Flota con vehículos antiguos (>5 años) sin programa de renovación.\n2. Conductores sin capacitación actualizada en manejo defensivo.\n3. Ausencia de inspecciones pre-operacionales estandarizadas.\n4. No se cuenta con plan de emergencias viales documentado.",
      conclusiones: "La empresa requiere implementar de manera urgente un programa integral de seguridad vial que cubra los 24 pasos de la Resolución 40595.",
    },
  });
  console.log("✅ Diagnóstico creado");

  // ─── DOCUMENTOS ──────────────────────────────────────────
  await prisma.documento.createMany({
    data: [
      {
        titulo: "Política de Seguridad Vial — TransCor S.A.S.",
        categoria: "POLITICA_SEGURIDAD_VIAL", version: 2, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 3, creadoPor: lider.id,
        contenido: "POLÍTICA DE SEGURIDAD VIAL\n\nTransCor S.A.S. se compromete con la seguridad vial como valor fundamental...\n\nVersión 2.1 | Aprobado por Comité PESV | Diciembre 2024",
      },
      {
        titulo: "Acta de Designación Líder PESV",
        categoria: "ACTA_DESIGNACION_LIDER", version: 1, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 1, creadoPor: admin.id,
        contenido: "ACTA DE DESIGNACIÓN\n\nSe designa a María Rodríguez como Líder del PESV de TransCor S.A.S.",
      },
      {
        titulo: "Acta Comité PESV — Diciembre 2024",
        categoria: "ACTA_COMITE", version: 1, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 2, creadoPor: admin.id,
        contenido: "ACTA DE REUNIÓN No. 012-2024\nCOMITÉ DE SEGURIDAD VIAL\n\nFecha: 20 de diciembre de 2024\nLugar: Sala de Juntas TransCor S.A.S.",
      },
      {
        titulo: "Diagnóstico Situación Actual PESV",
        categoria: "DIAGNOSTICO", version: 1, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 5, creadoPor: lider.id,
        contenido: "DIAGNÓSTICO DEL PESV\n\nAnálisis de la situación actual de seguridad vial en TransCor S.A.S.",
      },
      {
        titulo: "Procedimiento de Gestión de Riesgos Viales",
        categoria: "MATRIZ_RIESGOS", version: 1, estado: "REVISION", generadoIA: false,
        pasoResolucion: 6, creadoPor: lider.id,
        contenido: "PROCEDIMIENTO PR-SV-002\n\nGESTIÓN Y CONTROL DE RIESGOS VIALES\n\n1. Objetivo\n2. Alcance\n3. Responsabilidades\n4. Desarrollo del procedimiento...",
      },
      {
        titulo: "Formato de Inspección Vehicular Pre-Operacional",
        categoria: "FORMATO_INSPECCION", version: 1, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 16, creadoPor: lider.id,
        contenido: "FORMATO FO-SV-005\nINSPECCIÓN VEHICULAR PRE-OPERACIONAL\n\nFecha: _____ Placa: _____ Conductor: _____",
      },
      {
        titulo: "Programa de Gestión de Riesgos Críticos",
        categoria: "PROGRAMA_RIESGO_CRITICO", version: 1, estado: "BORRADOR", generadoIA: true,
        pasoResolucion: 8, creadoPor: lider.id,
        contenido: "PROGRAMA PG-SV-001\nGESTIÓN DE RIESGOS CRÍTICOS\n\nDocumento generado con apoyo de IA — Pendiente revisión del Líder PESV",
      },
      {
        titulo: "Indicadores PESV — Paso 20 — Resolución 40595",
        categoria: "INDICADOR", version: 2, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 20, creadoPor: lider.id,
        contenido: "FICHA DE INDICADORES PESV\nPASO 20 — RESOLUCIÓN 40595 DE 2022\n\n1. Tasa de accidentalidad\n2. Tasa de mortalidad\n3. Tasa de lesionados...",
      },
    ],
  });
  console.log("✅ Documentos creados");

  // ─── RIESGOS ──────────────────────────────────────────
  await prisma.riesgo.createMany({
    data: [
      {
        diagnosticoId: diagnostico.id,
        nombre: "Fatiga en rutas nocturnas",
        descripcion: "Conductores expuestos a rutas nocturnas sin pausas adecuadas.",
        categoria: "HUMANO", fuente: "conductor",
        probabilidad: 4, impacto: 5, nivelRiesgo: 20,
        controlExistente: "Límite de horas de conducción, registro de descansos",
        responsable: "Líder PESV", estado: "IDENTIFICADO",
      },
      {
        diagnosticoId: diagnostico.id,
        nombre: "Falla mecánica por mantenimiento deficiente",
        descripcion: "Vehículos con retrasos en mantenimiento preventivo.",
        categoria: "VEHICULAR", fuente: "vehiculo",
        probabilidad: 3, impacto: 4, nivelRiesgo: 12,
        controlExistente: "Plan de mantenimiento preventivo",
        responsable: "Jefe de Taller", estado: "EN_TRATAMIENTO",
      },
      {
        diagnosticoId: diagnostico.id,
        nombre: "Exceso de velocidad en vías secundarias",
        descripcion: "Conductores superan límites de velocidad en vías departamentales.",
        categoria: "HUMANO", fuente: "conductor",
        probabilidad: 4, impacto: 4, nivelRiesgo: 16,
        controlExistente: "Capacitaciones, GPS con alertas",
        responsable: "Líder PESV", estado: "CONTROLADO",
      },
      {
        diagnosticoId: diagnostico.id,
        nombre: "Condiciones adversas de vías",
        descripcion: "Vías departamentales con baches, derrumbes y señalización deficiente.",
        categoria: "INFRAESTRUCTURA", fuente: "via",
        probabilidad: 3, impacto: 3, nivelRiesgo: 9,
        controlExistente: "Reporte de condiciones de vía",
        responsable: "Operaciones", estado: "IDENTIFICADO",
      },
      {
        diagnosticoId: diagnostico.id,
        nombre: "Uso de celular durante la conducción",
        descripcion: "Conductores utilizan dispositivos móviles durante la operación.",
        categoria: "HUMANO", fuente: "conductor",
        probabilidad: 3, impacto: 4, nivelRiesgo: 12,
        controlExistente: "Política de uso de dispositivos",
        responsable: "Líder PESV", estado: "IDENTIFICADO",
      },
      {
        diagnosticoId: diagnostico.id,
        nombre: "Vehículos con documentación vencida",
        descripcion: "SOAT y tecnomecánica con fechas vencidas.",
        categoria: "VEHICULAR", fuente: "vehiculo",
        probabilidad: 2, impacto: 3, nivelRiesgo: 6,
        controlExistente: "Sistema de alertas de vencimiento",
        responsable: "Administrativo", estado: "CONTROLADO",
      },
      {
        nombre: "Condiciones climáticas adversas",
        descripcion: "Lluvias intensas en temporada invernal afectan visibilidad y adherencia.",
        categoria: "ENTORNO", fuente: "entorno",
        probabilidad: 3, impacto: 3, nivelRiesgo: 9,
        controlExistente: "Protocolo de conducción en lluvia",
        responsable: "Operaciones", estado: "ACEPTADO",
      },
      {
        nombre: "Falta de experiencia de conductores nuevos",
        descripcion: "Conductores recién vinculados sin inducción completa.",
        categoria: "GESTION", fuente: "conductor",
        probabilidad: 2, impacto: 4, nivelRiesgo: 8,
        controlExistente: "Programa de inducción",
        responsable: "Líder PESV", estado: "IDENTIFICADO",
      },
    ],
  });
  console.log("✅ Riesgos creados");

  // ─── CAPACITACIONES ──────────────────────────────────────────
  const cap1 = await prisma.capacitacion.create({
    data: {
      titulo: "Manejo Defensivo Avanzado",
      descripcion: "Técnicas avanzadas de manejo defensivo para prevenir accidentes.",
      contenido: "MÓDULO 1: Principios del manejo defensivo\nMÓDULO 2: Gestión del espacio\nMÓDULO 3: Anticipación de riesgos\nMÓDULO 4: Frenado de emergencia",
      duracion: 120, categoria: "conduccion_segura", obligatoria: true,
      preguntas: {
        create: [
          { enunciado: "¿Cuál es la distancia mínima de seguimiento en vía seca?", opciones: JSON.stringify(["1 segundo", "2 segundos", "3 segundos", "5 segundos"]), respuestaCorrecta: 2 },
          { enunciado: "El manejo defensivo implica principalmente:", opciones: JSON.stringify(["Conducir rápido", "Anticiparse a riesgos", "Usar el pito", "Adelantar siempre"]), respuestaCorrecta: 1 },
        ],
      },
    },
  });
  const cap2 = await prisma.capacitacion.create({
    data: {
      titulo: "Normas de Tránsito — Código Nacional",
      descripcion: "Actualización en normas del Código Nacional de Tránsito.",
      contenido: "MÓDULO 1: Señales de tránsito\nMÓDULO 2: Infracciones y sanciones\nMÓDULO 3: Responsabilidad civil y penal",
      duracion: 90, categoria: "normas_transito", obligatoria: true,
      preguntas: {
        create: [
          { enunciado: "¿Cuál es el límite de velocidad urbana para carga?", opciones: JSON.stringify(["30 km/h", "40 km/h", "50 km/h", "60 km/h"]), respuestaCorrecta: 2 },
        ],
      },
    },
  });
  const cap3 = await prisma.capacitacion.create({
    data: {
      titulo: "Prevención de Fatiga al Volante",
      descripcion: "Identificación y manejo de la fatiga durante operaciones.",
      contenido: "MÓDULO 1: Factores de fatiga\nMÓDULO 2: Gestión del descanso\nMÓDULO 3: Señales de alerta\nMÓDULO 4: Pausas activas",
      duracion: 60, categoria: "prevencion_fatiga", obligatoria: true,
      preguntas: {
        create: [
          { enunciado: "¿Cuántas horas continuas máximas de conducción?", opciones: JSON.stringify(["4 horas", "5 horas", "6 horas", "8 horas"]), respuestaCorrecta: 0 },
        ],
      },
    },
  });
  const cap4 = await prisma.capacitacion.create({
    data: {
      titulo: "Primeros Auxilios en Accidentes de Tránsito",
      descripcion: "Protocolos básicos de primeros auxilios en emergencias viales.",
      contenido: "MÓDULO 1: Evaluación de escena\nMÓDULO 2: Activación de emergencias\nMÓDULO 3: RCP básico\nMÓDULO 4: Inmovilización",
      duracion: 180, categoria: "primeros_auxilios", obligatoria: true,
    },
  });
  console.log("✅ Capacitaciones creadas");

  // ─── INSCRIPCIONES CAPACITACIONES ────────────────────────────
  const inscripciones = [
    { usuarioId: cond1.id, conductorId: conductor1.id, capacitacionId: cap1.id, puntaje: 92, aprobado: true, intentos: 1, completadoEn: new Date("2024-11-20") },
    { usuarioId: cond1.id, conductorId: conductor1.id, capacitacionId: cap2.id, puntaje: 85, aprobado: true, intentos: 1, completadoEn: new Date("2024-11-25") },
    { usuarioId: cond1.id, conductorId: conductor1.id, capacitacionId: cap3.id, puntaje: null, aprobado: false, intentos: 0, completadoEn: null },
    { usuarioId: cond2.id, conductorId: conductor2.id, capacitacionId: cap1.id, puntaje: 58, aprobado: false, intentos: 2, completadoEn: new Date("2024-10-15") },
    { usuarioId: cond3.id, conductorId: conductor3.id, capacitacionId: cap1.id, puntaje: 96, aprobado: true, intentos: 1, completadoEn: new Date("2024-12-01") },
    { usuarioId: cond3.id, conductorId: conductor3.id, capacitacionId: cap2.id, puntaje: 90, aprobado: true, intentos: 1, completadoEn: new Date("2024-12-05") },
    { usuarioId: cond3.id, conductorId: conductor3.id, capacitacionId: cap3.id, puntaje: 88, aprobado: true, intentos: 1, completadoEn: new Date("2024-12-10") },
    { usuarioId: cond4.id, conductorId: conductor4.id, capacitacionId: cap1.id, puntaje: 78, aprobado: true, intentos: 1, completadoEn: new Date("2024-11-30") },
    { usuarioId: cond5.id, conductorId: conductor5.id, capacitacionId: cap2.id, puntaje: null, aprobado: false, intentos: 0, completadoEn: null },
  ];
  for (const ins of inscripciones) {
    await prisma.usuarioCapacitacion.create({ data: ins });
  }
  console.log("✅ Inscripciones creadas");

  // ─── INCIDENTES ──────────────────────────────────────────
  await prisma.incidente.createMany({
    data: [
      {
        tipo: "ACCIDENTE_SOLO_DANOS", descripcion: "Colisión con vehículo particular en intersección.", fecha: new Date("2024-09-15"), hora: "14:30",
        lugar: "Cra 15 con Cll 23", municipio: "Montería", departamento: "Córdoba",
        vehiculoId: v1.id, conductorId: conductor1.id, reportadoPor: lider.id,
        lesionados: 1, muertos: 0, costoEstimado: 3500000, severidad: "ALTO", estado: "CERRADO",
        causasDirectas: "Omisión señal de tránsito", causasBasicas: "Fatiga acumulada",
        investigacion: "Causa directa: omisión señal de tránsito. Causa básica: fatiga acumulada.",
      },
      {
        tipo: "CASI_ACCIDENTE", descripcion: "Casi colisión con motociclista al cambiar de carril.", fecha: new Date("2024-10-22"), hora: "08:15",
        lugar: "Carretera Montería-Cereté km 12", municipio: "Cereté", departamento: "Córdoba",
        vehiculoId: v2.id, conductorId: conductor3.id, reportadoPor: cond3.id,
        lesionados: 0, muertos: 0, costoEstimado: 0, severidad: "CRITICO", estado: "CERRADO",
      },
      {
        tipo: "INFRACCION_TRANSITO", descripcion: "Exceso de velocidad en zona escolar.", fecha: new Date("2024-11-05"), hora: "07:45",
        lugar: "Av. Circunvalar - Colegio La Presentación", municipio: "Montería", departamento: "Córdoba",
        vehiculoId: v3.id, conductorId: conductor2.id, reportadoPor: admin.id,
        lesionados: 0, muertos: 0, costoEstimado: 790000, severidad: "MODERADO", estado: "CERRADO",
      },
      {
        tipo: "ACCIDENTE_SOLO_DANOS", descripcion: "Daño en guardabarro al maniobrar en zona de descargue.", fecha: new Date("2024-12-18"), hora: "16:20",
        lugar: "Calle 41 con Carretera a Planeta Rica", municipio: "Montería", departamento: "Córdoba",
        vehiculoId: v4.id, conductorId: conductor1.id, reportadoPor: lider.id,
        lesionados: 0, muertos: 0, costoEstimado: 850000, severidad: "ALTO", estado: "CERRADO",
      },
      {
        tipo: "CASI_ACCIDENTE", descripcion: "Vehículo anterior frenó bruscamente. Derrape controlado.", fecha: new Date("2025-01-10"), hora: "11:00",
        lugar: "Vía Montería-Tierralta km 35", municipio: "Montería", departamento: "Córdoba",
        vehiculoId: v5.id, conductorId: conductor4.id, reportadoPor: cond4.id,
        lesionados: 0, muertos: 0, costoEstimado: 0, severidad: "ALTO", estado: "EN_INVESTIGACION",
      },
      {
        tipo: "ACCIDENTE_CON_LESIONADOS", descripcion: "Colisión trasera en semáforo.", fecha: new Date("2025-01-28"), hora: "09:30",
        lugar: "Cra 2 con Cll 29", municipio: "Montería", departamento: "Córdoba",
        vehiculoId: v2.id, conductorId: conductor5.id, reportadoPor: lider.id,
        lesionados: 1, muertos: 0, costoEstimado: 1200000, severidad: "MODERADO", estado: "REPORTADO",
      },
    ],
  });
  console.log("✅ Incidentes creados");

  // ─── PLAN ANUAL DE TRABAJO ──────────────────────────────
  await prisma.planAnualTrabajo.create({
    data: {
      anio: 2025,
      objetivos: "1. Reducir accidentalidad en 20%\n2. Capacitar al 100% de conductores\n3. Implementar inspecciones preoperacionales diarias\n4. Completar los 24 pasos de la Resolución 40595",
      actividades: JSON.stringify([
        { nombre: "Diagnóstico inicial PESV", responsable: "Líder PESV", fechaInicio: "2025-01-15", fechaFin: "2025-02-15", estado: "COMPLETADA", presupuesto: 500000 },
        { nombre: "Constitución Comité Seguridad Vial", responsable: "Gerencia", fechaInicio: "2025-02-01", fechaFin: "2025-02-28", estado: "COMPLETADA", presupuesto: 0 },
        { nombre: "Capacitación manejo defensivo", responsable: "Líder PESV", fechaInicio: "2025-03-01", fechaFin: "2025-04-30", estado: "EN_EJECUCION", presupuesto: 2000000 },
        { nombre: "Implementar inspecciones preoperacionales", responsable: "Jefe Operaciones", fechaInicio: "2025-04-01", fechaFin: "2025-05-31", estado: "EN_EJECUCION", presupuesto: 300000 },
        { nombre: "Auditoría interna PESV", responsable: "Líder PESV", fechaInicio: "2025-10-01", fechaFin: "2025-11-30", estado: "PENDIENTE", presupuesto: 1500000 },
      ]),
      estado: "EN_EJECUCION",
    },
  });
  console.log("✅ Plan anual de trabajo creado");

  // ─── PLAN DE EMERGENCIAS ──────────────────────────────
  await prisma.planEmergencia.create({
    data: {
      titulo: "Plan de Emergencias Viales TransCor S.A.S.",
      descripcion: "Plan de preparación y respuesta ante emergencias viales conforme al paso 12 de la Resolución 40595.",
      procedimientos: "1. Activar sistema de emergencias (123, 119)\n2. Asegurar la escena del accidente\n3. Brindar primeros auxilios\n4. Notificar al Líder PESV\n5. Documentar el evento con fotos\n6. Preservar evidencias",
      contactosEmergencia: JSON.stringify([
        { nombre: "Línea de Emergencias", telefono: "123", entidad: "Nacional" },
        { nombre: "Bomberos", telefono: "119", entidad: "Montería" },
        { nombre: "Cruz Roja", telefono: "132", entidad: "Montería" },
        { nombre: "María Rodríguez (Líder PESV)", telefono: "3001234567", entidad: "TransCor" },
      ]),
      version: 1,
    },
  });
  console.log("✅ Plan de emergencias creado");

  // ─── DESPLAZAMIENTOS ──────────────────────────────
  await prisma.desplazamiento.createMany({
    data: [
      { conductorId: conductor1.id, vehiculoId: v1.id, origen: "Montería", destino: "Cereté", fechaSalida: new Date("2025-01-20T06:00:00"), fechaLlegada: new Date("2025-01-20T07:30:00"), distanciaKm: 35, observaciones: "Ruta normal sin novedades" },
      { conductorId: conductor3.id, vehiculoId: v2.id, origen: "Montería", destino: "Lorica", fechaSalida: new Date("2025-01-21T05:30:00"), fechaLlegada: new Date("2025-01-21T08:00:00"), distanciaKm: 65 },
      { conductorId: conductor4.id, vehiculoId: v4.id, origen: "Montería", destino: "Tierralta", fechaSalida: new Date("2025-01-22T04:00:00"), fechaLlegada: new Date("2025-01-22T08:30:00"), distanciaKm: 110, observaciones: "Vía en buen estado" },
    ],
  });
  console.log("✅ Desplazamientos creados");

  // ─── ACCIONES CORRECTIVAS ──────────────────────────────
  await prisma.accionCorrectiva.createMany({
    data: [
      { tipo: "correctiva", descripcion: "Refuerzo en capacitación de señales de tránsito para el conductor involucrado.", responsable: "Líder PESV", usuarioId: lider.id, fechaLimite: new Date("2025-03-15"), estado: "EN_EJECUCION" },
      { tipo: "preventiva", descripcion: "Implementar checklist de inspección preoperacional obligatorio.", responsable: "Jefe de Operaciones", usuarioId: lider.id, fechaLimite: new Date("2025-02-28"), estado: "PENDIENTE" },
      { tipo: "mejora", descripcion: "Instalar sistema GPS con alertas de velocidad en toda la flota.", responsable: "Gerencia", usuarioId: admin.id, fechaLimite: new Date("2025-06-30"), estado: "PENDIENTE" },
    ],
  });
  console.log("✅ Acciones correctivas creadas");

  // ─── REPORTE AUTOGESTIÓN ──────────────────────────────
  await prisma.reporteAutogestion.create({
    data: {
      anio: 2025, mes: 1,
      indicadorMetas: 45, indicadorAccidentes: 2.4, indicadorMuertos: 0,
      indicadorLesionados: 1, indicadorCapacitaciones: 60, indicadorMantenimiento: 80,
      indicadorInspecciones: 15, indicadorExcesoVelocidad: 3, indicadorJornadaExcedida: 1,
      indicadorVehiculosPrograma: 2, cumplimientoGeneral: 52,
      observaciones: "Primer mes de seguimiento. Se requiere mejorar la cobertura de capacitaciones.",
    },
  });
  console.log("✅ Reporte de autogestión creado");

  // ─── AUDITORÍA ──────────────────────────────────────
  await prisma.auditoria.create({
    data: {
      anio: 2024, tipo: "interna",
      fechaInicio: new Date("2024-11-01"), fechaFin: new Date("2024-11-15"),
      auditor: "Consultora SGI Colombia S.A.S.",
      hallazgos: "1. Falta documentar el diagnóstico inicial (Paso 5)\n2. Matriz de riesgos incompleta (Paso 6)\n3. No se evidencia plan de emergencias (Paso 12)\n4. Inspecciones preoperacionales no estandarizadas (Paso 16)",
      noConformidades: JSON.stringify([
        { descripcion: "Ausencia de diagnóstico documentado", paso: 5, nivel: "Mayor", fechaLimite: "2025-02-28" },
        { descripcion: "Plan de emergencias inexistente", paso: 12, nivel: "Mayor", fechaLimite: "2025-03-31" },
        { descripcion: "Formato de inspección no estandarizado", paso: 16, nivel: "Menor", fechaLimite: "2025-01-31" },
      ]),
      recomendaciones: "Se recomienda priorizar la documentación de los pasos faltantes y establecer un cronograma de implementación con fechas límite.",
      estado: "COMPLETADA",
    },
  });
  console.log("✅ Auditoría creada");

  // ─── PROGRAMA RIESGO CRÍTICO ──────────────────────────────
  await prisma.programaRiesgoCritico.create({
    data: {
      nombre: "Programa de Gestión de Velocidad",
      objetivo: "Reducir los eventos de exceso de velocidad en un 80% durante 2025.",
      alcance: "Todos los vehículos y conductores de TransCor S.A.S.",
      actividades: JSON.stringify([
        { nombre: "Instalación GPS con alertas", fecha: "2025-03-01", estado: "PENDIENTE" },
        { nombre: "Capacitación manejo seguro", fecha: "2025-04-01", estado: "PENDIENTE" },
        { nombre: "Seguimiento mensual velocidades", fecha: "2025-05-01", estado: "PENDIENTE" },
      ]),
      responsable: "Líder PESV",
      indicadores: JSON.stringify([
        { nombre: "Eventos exceso velocidad/mes", meta: "< 2", actual: "3" },
        { nombre: "% conductores sensibilizados", meta: "100%", actual: "60%" },
      ]),
      presupuesto: 5000000,
    },
  });
  console.log("✅ Programa de riesgo crítico creado");

  // ─── ALERTAS ────────────────────────────────────────
  const hoy = new Date();
  const diffDias = (fecha) => Math.ceil((new Date(fecha) - hoy) / (1000 * 60 * 60 * 24));

  await prisma.alerta.createMany({
    data: [
      { tipo: "SOAT_VENCIMIENTO", mensaje: "Vehículo GHI-789: SOAT VENCIDO desde 05/01/2025", entidadId: v3.id, entidadTipo: "vehiculo", diasRestantes: diffDias("2025-01-05") },
      { tipo: "TECNOMECANICA_VENCIMIENTO", mensaje: "Vehículo GHI-789: Tecnomecánica VENCIDA desde 20/11/2024", entidadId: v3.id, entidadTipo: "vehiculo", diasRestantes: diffDias("2024-11-20") },
      { tipo: "SOAT_VENCIMIENTO", mensaje: "Vehículo ABC-123: SOAT VENCIDO desde 28/02/2025", entidadId: v1.id, entidadTipo: "vehiculo", diasRestantes: diffDias("2025-02-28") },
      { tipo: "LICENCIA_VENCIMIENTO", mensaje: "Conductor Pedro Sánchez: Licencia VENCIDA desde 01/12/2024", entidadId: conductor2.id, entidadTipo: "conductor", diasRestantes: diffDias("2024-12-01") },
      { tipo: "CAPACITACION_PENDIENTE", mensaje: "3 conductores con capacitaciones obligatorias pendientes", entidadId: "general", entidadTipo: "capacitacion" },
      { tipo: "INSPECCION_PENDIENTE", mensaje: "2 vehículos sin inspección preoperacional esta semana", entidadId: "general", entidadTipo: "vehiculo" },
    ],
  });
  console.log("✅ Alertas creadas");

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📋 Credenciales de acceso:");
  console.log("   Admin:    admin@pesv.co    / admin123");
  console.log("   Líder:    lider@pesv.co    / lider123");
  console.log("   Gerente:  gerente@pesv.co  / gerente123");
  console.log("   Comité:   comite@pesv.co   / comite123");
  console.log("   Cond 1-5: c1@pesv.co       / cond123");
}

main()
  .catch((e) => { console.error("❌ Error en seed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
