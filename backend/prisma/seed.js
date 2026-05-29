const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos PESV Digital...");

  // Limpiar en orden correcto
  await prisma.alerta.deleteMany();
  await prisma.usuarioCapacitacion.deleteMany();
  await prisma.pregunta.deleteMany();
  await prisma.capacitacion.deleteMany();
  await prisma.incidente.deleteMany();
  await prisma.mantenimiento.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.riesgo.deleteMany();
  await prisma.conductor.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();

  // ─── USUARIOS ──────────────────────────────────────────
  const hash = (pwd) => bcrypt.hashSync(pwd, 10);

  const admin = await prisma.usuario.create({
    data: { nombre: "Administrador PESV", email: "admin@pesv.co", password: hash("admin123"), rol: "ADMIN" },
  });
  const lider = await prisma.usuario.create({
    data: { nombre: "María Rodríguez", email: "lider@pesv.co", password: hash("lider123"), rol: "LIDER_PESV" },
  });
  const gerente = await prisma.usuario.create({
    data: { nombre: "Carlos Jiménez", email: "gerente@pesv.co", password: hash("gerente123"), rol: "GERENTE" },
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

  // Usuarios adicionales para conductores 4 y 5
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
      estado: "operativo",
    },
  });
  const v2 = await prisma.vehiculo.create({
    data: {
      placa: "DEF-456", marca: "Toyota", modelo: "Hilux", anio: 2021,
      tipo: "Camioneta", kilometraje: 87430,
      soatVencimiento: new Date("2025-09-10"),
      tecnomecanicaVencimiento: new Date("2025-09-10"),
      estado: "operativo",
    },
  });
  const v3 = await prisma.vehiculo.create({
    data: {
      placa: "GHI-789", marca: "Mercedes", modelo: "OF-1721", anio: 2018,
      tipo: "Bus", kilometraje: 234100,
      soatVencimiento: new Date("2025-01-05"),
      tecnomecanicaVencimiento: new Date("2024-11-20"),
      estado: "mantenimiento",
    },
  });
  const v4 = await prisma.vehiculo.create({
    data: {
      placa: "JKL-012", marca: "Kenworth", modelo: "T800", anio: 2020,
      tipo: "Camión", kilometraje: 198450,
      soatVencimiento: new Date("2025-07-30"),
      tecnomecanicaVencimiento: new Date("2025-08-15"),
      estado: "operativo",
    },
  });
  const v5 = await prisma.vehiculo.create({
    data: {
      placa: "MNO-345", marca: "Ford", modelo: "Ranger", anio: 2022,
      tipo: "Camioneta", kilometraje: 52100,
      soatVencimiento: new Date("2026-01-20"),
      tecnomecanicaVencimiento: new Date("2026-01-20"),
      estado: "operativo",
    },
  });

  // Mantenimientos de ejemplo
  await prisma.mantenimiento.createMany({
    data: [
      { vehiculoId: v1.id, tipo: "preventivo", descripcion: "Cambio de aceite y filtros", costo: 450000, fecha: new Date("2024-11-10"), taller: "Taller Central Montería" },
      { vehiculoId: v3.id, tipo: "correctivo", descripcion: "Reparación sistema de frenos", costo: 1200000, fecha: new Date("2024-12-05"), taller: "AutoFreno S.A." },
      { vehiculoId: v2.id, tipo: "preventivo", descripcion: "Revisión general 80.000 km", costo: 320000, fecha: new Date("2025-01-15"), taller: "Toyota Authorized Service" },
    ],
  });

  console.log("✅ Vehículos y mantenimientos creados");

  // ─── CONDUCTORES ──────────────────────────────────────────
  const conductor1 = await prisma.conductor.create({
    data: {
      usuarioId: cond1.id, cedula: "1045234567", telefono: "3145678901",
      licenciaCategoria: "B2", licenciaVencimiento: new Date("2025-08-15"),
      estado: "activo", vehiculoId: v1.id,
    },
  });
  const conductor2 = await prisma.conductor.create({
    data: {
      usuarioId: cond2.id, cedula: "1098765432", telefono: "3167890123",
      licenciaCategoria: "C1", licenciaVencimiento: new Date("2024-12-01"),
      estado: "suspendido", vehiculoId: v3.id,
    },
  });
  const conductor3 = await prisma.conductor.create({
    data: {
      usuarioId: cond3.id, cedula: "1056789012", telefono: "3189012345",
      licenciaCategoria: "B2", licenciaVencimiento: new Date("2026-03-20"),
      estado: "activo", vehiculoId: v2.id,
    },
  });
  const conductor4 = await prisma.conductor.create({
    data: {
      usuarioId: cond4.id, cedula: "1034567890", telefono: "3112345678",
      licenciaCategoria: "B2", licenciaVencimiento: new Date("2025-11-30"),
      estado: "activo", vehiculoId: v4.id,
    },
  });
  const conductor5 = await prisma.conductor.create({
    data: {
      usuarioId: cond5.id, cedula: "1067890123", telefono: "3134567890",
      licenciaCategoria: "C1", licenciaVencimiento: new Date("2025-06-10"),
      estado: "activo", vehiculoId: v5.id,
    },
  });

  console.log("✅ Conductores creados");

  // ─── DOCUMENTOS ──────────────────────────────────────────
  await prisma.documento.createMany({
    data: [
      {
        titulo: "Política de Seguridad Vial — TransCor S.A.S.",
        categoria: "Políticas", version: 2, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 3, creadoPor: lider.id,
        contenido: "POLÍTICA DE SEGURIDAD VIAL\n\nTransCor S.A.S. se compromete con la seguridad vial como valor fundamental...\n\nVersión 2.1 | Aprobado por Comité PESV | Diciembre 2024",
      },
      {
        titulo: "Procedimiento de Gestión de Riesgos Viales",
        categoria: "Procedimientos", version: 1, estado: "REVISION", generadoIA: false,
        pasoResolucion: 6, creadoPor: lider.id,
        contenido: "PROCEDIMIENTO PR-SV-002\n\nGESTIÓN Y CONTROL DE RIESGOS VIALES\n\n1. Objetivo\n2. Alcance\n3. Responsabilidades\n4. Desarrollo del procedimiento...",
      },
      {
        titulo: "Acta Comité PESV — Diciembre 2024",
        categoria: "Actas", version: 1, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 2, creadoPor: admin.id,
        contenido: "ACTA DE REUNIÓN No. 012-2024\nCOMITÉ DE SEGURIDAD VIAL\n\nFecha: 20 de diciembre de 2024\nLugar: Sala de Juntas TransCor S.A.S.\n...",
      },
      {
        titulo: "Formato de Inspección Vehicular Pre-Operacional",
        categoria: "Formatos", version: 1, estado: "APROBADO", generadoIA: false,
        pasoResolucion: 11, creadoPor: lider.id,
        contenido: "FORMATO FO-SV-005\nINSPECCIÓN VEHICULAR PRE-OPERACIONAL\n\nFecha: _____ Placa: _____ Conductor: _____\n\nSistema de frenos: [ ] Óptimo [ ] Regular [ ] Deficiente\n...",
      },
      {
        titulo: "Programa de Gestión de Riesgos Críticos",
        categoria: "Programas", version: 1, estado: "BORRADOR", generadoIA: true,
        pasoResolucion: 8, creadoPor: lider.id,
        contenido: "PROGRAMA PG-SV-001\nGESTIÓN DE RIESGOS CRÍTICOS\n\nDocumento generado con apoyo de IA — Pendiente revisión del Líder PESV\n...",
      },
      {
        titulo: "Indicadores PESV — Paso 20 — Resolución 40595",
        categoria: "Indicadores", version: 2, estado: "APROBADO", generadoIA: false,
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
        nombre: "Fatiga en rutas nocturnas",
        descripcion: "Conductores expuestos a rutas nocturnas sin pausas adecuadas, aumentando el riesgo de microsueño y pérdida de concentración.",
        categoria: "HUMANO", fuente: "Análisis accidentes 2023-2024",
        probabilidad: 4, impacto: 5, nivelRiesgo: 20,
        controlExistente: "Límite de horas de conducción, registro de descansos",
        responsable: "Líder PESV", estado: "IDENTIFICADO", pasoPESV: "Paso 8",
      },
      {
        nombre: "Falla mecánica por mantenimiento deficiente",
        descripcion: "Vehículos con retrasos en mantenimiento preventivo presentan mayor probabilidad de fallas mecánicas en ruta.",
        categoria: "VEHICULAR", fuente: "Histórico mantenimientos",
        probabilidad: 3, impacto: 4, nivelRiesgo: 12,
        controlExistente: "Plan de mantenimiento preventivo, inspección pre-operacional",
        responsable: "Jefe de Taller", estado: "IDENTIFICADO", pasoPESV: "Paso 11",
      },
      {
        nombre: "Exceso de velocidad en vías secundarias",
        descripcion: "Conductores superan límites de velocidad en vías departamentales con alta siniestralidad.",
        categoria: "HUMANO", fuente: "Informes de tránsito",
        probabilidad: 4, impacto: 4, nivelRiesgo: 16,
        controlExistente: "Capacitaciones normas tránsito, GPS con alertas de velocidad",
        responsable: "Líder PESV", estado: "EN_CONTROL", pasoPESV: "Paso 8",
      },
      {
        nombre: "Condiciones adversas de vías en mal estado",
        descripcion: "Vías departamentales con baches, derrumbes y señalización deficiente en rutas operadas.",
        categoria: "INFRAESTRUCTURA", fuente: "Reporte conductores",
        probabilidad: 3, impacto: 3, nivelRiesgo: 9,
        controlExistente: "Reporte de condiciones de vía, rutas alternativas",
        responsable: "Operaciones", estado: "IDENTIFICADO", pasoPESV: "Paso 7",
      },
      {
        nombre: "Uso de celular durante la conducción",
        descripcion: "Conductores utilizan dispositivos móviles durante la operación, reduciendo tiempos de reacción.",
        categoria: "HUMANO", fuente: "Observación directa",
        probabilidad: 3, impacto: 4, nivelRiesgo: 12,
        controlExistente: "Política de uso de dispositivos, soporte manos libres",
        responsable: "Líder PESV", estado: "IDENTIFICADO", pasoPESV: "Paso 8",
      },
      {
        nombre: "Vehículos con documentación vencida",
        descripcion: "SOAT y tecnomecánica con fechas de vencimiento próximas o vencidas aumentan el riesgo legal y operacional.",
        categoria: "VEHICULAR", fuente: "Revisión documental",
        probabilidad: 2, impacto: 3, nivelRiesgo: 6,
        controlExistente: "Sistema de alertas de vencimiento",
        responsable: "Administrativo", estado: "EN_CONTROL", pasoPESV: "Paso 11",
      },
    ],
  });

  console.log("✅ Riesgos creados");

  // ─── CAPACITACIONES ──────────────────────────────────────────
  const cap1 = await prisma.capacitacion.create({
    data: {
      titulo: "Manejo Defensivo Avanzado",
      descripcion: "Técnicas avanzadas de manejo defensivo para prevenir accidentes en condiciones adversas.",
      contenido: "MÓDULO 1: Principios del manejo defensivo\nMÓDULO 2: Gestión del espacio y distancia segura\nMÓDULO 3: Anticipación de situaciones de riesgo\nMÓDULO 4: Técnicas de frenado de emergencia\nMÓDULO 5: Evaluación práctica",
      duracion: 120, categoria: "conduccion_segura", obligatoria: true,
      preguntas: {
        create: [
          { enunciado: "¿Cuál es la distancia mínima de seguimiento recomendada en vía seca?", opciones: JSON.stringify(["1 segundo", "2 segundos", "3 segundos", "5 segundos"]), respuestaCorrecta: 2 },
          { enunciado: "El manejo defensivo implica principalmente:", opciones: JSON.stringify(["Conducir rápido", "Anticiparse a situaciones de riesgo", "Usar el pito frecuentemente", "Adelantar cuando sea posible"]), respuestaCorrecta: 1 },
        ],
      },
    },
  });

  const cap2 = await prisma.capacitacion.create({
    data: {
      titulo: "Normas de Tránsito — Código Nacional",
      descripcion: "Actualización en normas del Código Nacional de Tránsito y Transporte vigentes.",
      contenido: "MÓDULO 1: Señales de tránsito\nMÓDULO 2: Infracciones y sanciones\nMÓDULO 3: Responsabilidad civil y penal\nMÓDULO 4: Caso especial vehículos de carga",
      duracion: 90, categoria: "normas_transito", obligatoria: true,
      preguntas: {
        create: [
          { enunciado: "¿Cuál es el límite de velocidad en zona urbana para vehículos de carga?", opciones: JSON.stringify(["30 km/h", "40 km/h", "50 km/h", "60 km/h"]), respuestaCorrecta: 2 },
        ],
      },
    },
  });

  const cap3 = await prisma.capacitacion.create({
    data: {
      titulo: "Prevención de Fatiga al Volante",
      descripcion: "Identificación y manejo de la fatiga durante operaciones de transporte.",
      contenido: "MÓDULO 1: Factores que generan fatiga\nMÓDULO 2: Técnicas de gestión del descanso\nMÓDULO 3: Señales de alerta temprana\nMÓDULO 4: Pausas activas efectivas",
      duracion: 60, categoria: "prevencion_fatiga", obligatoria: true,
      preguntas: {
        create: [
          { enunciado: "¿Cuántas horas continuas máximas de conducción establece la norma?", opciones: JSON.stringify(["4 horas", "5 horas", "6 horas", "8 horas"]), respuestaCorrecta: 0 },
        ],
      },
    },
  });

  const cap4 = await prisma.capacitacion.create({
    data: {
      titulo: "Primeros Auxilios en Accidentes de Tránsito",
      descripcion: "Protocolos básicos de primeros auxilios para situaciones de emergencia vial.",
      contenido: "MÓDULO 1: Evaluación de la escena\nMÓDULO 2: Activación del sistema de emergencias\nMÓDULO 3: RCP básico\nMÓDULO 4: Inmovilización de lesionados\nMÓDULO 5: Práctica simulada",
      duracion: 180, categoria: "primeros_auxilios", obligatoria: true,
    },
  });

  console.log("✅ Capacitaciones creadas");

  // ─── INSCRIPCIONES CAPACITACIONES ────────────────────────────
  const inscripciones = [
    { usuarioId: cond1.id, conductorId: conductor1.id, capacitacionId: cap1.id, puntaje: 92, aprobado: true, completadoEn: new Date("2024-11-20") },
    { usuarioId: cond1.id, conductorId: conductor1.id, capacitacionId: cap2.id, puntaje: 85, aprobado: true, completadoEn: new Date("2024-11-25") },
    { usuarioId: cond1.id, conductorId: conductor1.id, capacitacionId: cap3.id, puntaje: null, aprobado: false, completadoEn: null },
    { usuarioId: cond2.id, conductorId: conductor2.id, capacitacionId: cap1.id, puntaje: 58, aprobado: false, completadoEn: new Date("2024-10-15") },
    { usuarioId: cond3.id, conductorId: conductor3.id, capacitacionId: cap1.id, puntaje: 96, aprobado: true, completadoEn: new Date("2024-12-01") },
    { usuarioId: cond3.id, conductorId: conductor3.id, capacitacionId: cap2.id, puntaje: 90, aprobado: true, completadoEn: new Date("2024-12-05") },
    { usuarioId: cond3.id, conductorId: conductor3.id, capacitacionId: cap3.id, puntaje: 88, aprobado: true, completadoEn: new Date("2024-12-10") },
    { usuarioId: cond4.id, conductorId: conductor4.id, capacitacionId: cap1.id, puntaje: 78, aprobado: true, completadoEn: new Date("2024-11-30") },
    { usuarioId: cond5.id, conductorId: conductor5.id, capacitacionId: cap2.id, puntaje: null, aprobado: false, completadoEn: null },
  ];

  for (const ins of inscripciones) {
    await prisma.usuarioCapacitacion.create({ data: ins });
  }

  console.log("✅ Inscripciones de capacitaciones creadas");

  // ─── INCIDENTES ──────────────────────────────────────────
  await prisma.incidente.createMany({
    data: [
      {
        tipo: "ACCIDENTE", descripcion: "Colisión con vehículo particular en intersección. El conductor no observó el semáforo en rojo.", fecha: new Date("2024-09-15"),
        lugar: "Cra 15 con Cll 23", municipio: "Montería",
        vehiculoId: v1.id, conductorId: conductor1.id, reportadoPor: lider.id,
        lesionados: 1, muertos: 0, costoEstimado: 3500000, severidad: "ALTO", estado: "CERRADO",
        investigacion: "Causa directa: omisión señal de tránsito. Causa básica: fatiga acumulada.",
      },
      {
        tipo: "CASI_ACCIDENTE", descripcion: "Casi colisión con motociclista al hacer cambio de carril sin verificar punto ciego.", fecha: new Date("2024-10-22"),
        lugar: "Carretera Montería-Cereté km 12", municipio: "Cereté",
        vehiculoId: v2.id, conductorId: conductor3.id, reportadoPor: cond3.id,
        lesionados: 0, muertos: 0, costoEstimado: 0, severidad: "CRITICO", estado: "CERRADO",
      },
      {
        tipo: "INFRACCION", descripcion: "Exceso de velocidad detectado por radar en zona escolar. Comparendo C36.", fecha: new Date("2024-11-05"),
        lugar: "Av. Circunvalar frente al Colegio La Presentación", municipio: "Montería",
        vehiculoId: v3.id, conductorId: conductor2.id, reportadoPor: admin.id,
        lesionados: 0, muertos: 0, costoEstimado: 790000, severidad: "MODERADO", estado: "CERRADO",
      },
      {
        tipo: "ACCIDENTE", descripcion: "Daño en guardabarro al maniobrar en zona de descargue. No hay lesionados.", fecha: new Date("2024-12-18"),
        lugar: "Calle 41 con Carretera a Planeta Rica", municipio: "Montería",
        vehiculoId: v4.id, conductorId: conductor1.id, reportadoPor: lider.id,
        lesionados: 0, muertos: 0, costoEstimado: 850000, severidad: "ALTO", estado: "CERRADO",
      },
      {
        tipo: "CASI_ACCIDENTE", descripcion: "Conductor reporta que el vehículo anterior frenó bruscamente. Logró detener a tiempo pero con derrape.", fecha: new Date("2025-01-10"),
        lugar: "Vía Montería-Tierralta km 35", municipio: "Montería",
        vehiculoId: v5.id, conductorId: conductor4.id, reportadoPor: cond4.id,
        lesionados: 0, muertos: 0, costoEstimado: 0, severidad: "ALTO", estado: "EN_INVESTIGACION",
      },
      {
        tipo: "ACCIDENTE", descripcion: "Colisión trasera en semáforo. Impacto a baja velocidad. Daños materiales menores en ambos vehículos.", fecha: new Date("2025-01-28"),
        lugar: "Cra 2 con Cll 29", municipio: "Montería",
        vehiculoId: v2.id, conductorId: conductor5.id, reportadoPor: lider.id,
        lesionados: 0, muertos: 0, costoEstimado: 1200000, severidad: "MODERADO", estado: "REPORTADO",
      },
    ],
  });

  console.log("✅ Incidentes creados");

  // ─── ALERTAS INICIALES ────────────────────────────────────────
  const hoy = new Date();
  const diffDias = (fecha) => Math.ceil((new Date(fecha) - hoy) / (1000 * 60 * 60 * 24));

  const alertasData = [];

  // Alerta SOAT vencido GHI-789
  alertasData.push({
    tipo: "SOAT_VENCIDO", mensaje: `Vehículo GHI-789 (Mercedes OF-1721): SOAT VENCIDO desde el 05/01/2025`,
    entidadId: v3.id, entidadTipo: "Vehiculo", diasRestantes: diffDias("2025-01-05"), leida: false,
  });
  // Alerta Tecnomecánica vencida GHI-789
  alertasData.push({
    tipo: "TECNOMECANICA_VENCIDA", mensaje: `Vehículo GHI-789: Revisión técnico-mecánica VENCIDA desde el 20/11/2024`,
    entidadId: v3.id, entidadTipo: "Vehiculo", diasRestantes: diffDias("2024-11-20"), leida: false,
  });
  // Alerta SOAT vencido ABC-123
  alertasData.push({
    tipo: "SOAT_VENCIDO", mensaje: `Vehículo ABC-123 (Chevrolet NPR): SOAT VENCIDO desde el 28/02/2025`,
    entidadId: v1.id, entidadTipo: "Vehiculo", diasRestantes: diffDias("2025-02-28"), leida: false,
  });
  // Alerta licencia Pedro Sánchez
  alertasData.push({
    tipo: "LICENCIA_VENCIDA", mensaje: `Conductor Pedro Sánchez (CC 1098765432): Licencia de conducción VENCIDA desde el 01/12/2024`,
    entidadId: conductor2.id, entidadTipo: "Conductor", diasRestantes: diffDias("2024-12-01"), leida: false,
  });
  // Incidente sin investigar
  alertasData.push({
    tipo: "INCIDENTE_SIN_INVESTIGAR", mensaje: `Incidente INC-006 de 28/01/2025 lleva más de 7 días sin investigación formal`,
    entidadId: "INC-006", entidadTipo: "Incidente", diasRestantes: null, leida: false,
  });

  await prisma.alerta.createMany({ data: alertasData });

  console.log("✅ Alertas iniciales creadas");
  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📋 Credenciales de acceso:");
  console.log("   Admin:   admin@pesv.co   / admin123");
  console.log("   Líder:   lider@pesv.co   / lider123");
  console.log("   Gerente: gerente@pesv.co / gerente123");
  console.log("   Cond 1:  c1@pesv.co      / cond123");
}

main()
  .catch((e) => { console.error("❌ Error en seed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
