const genAI = require("../../config/claude");

const SYSTEM_PESV = `Eres un experto en el Plan Estratégico de Seguridad Vial (PESV) de Colombia, con dominio total de la Resolución 40595 de 2022 del Ministerio de Transporte. La empresa se llama TransCor S.A.S., tiene 25 conductores, 18 vehículos, nivel PESV Estándar, sede en Montería, Córdoba. Genera documentos formales en español, listos para ser usados por el líder PESV. Usa formato profesional con numeración de secciones, fechas del año en curso y referencias exactas a artículos de la resolución.`;

const PROMPTS = {
  POLITICA_SEGURIDAD_VIAL: (ctx) =>
    `Genera la Política de Seguridad Vial completa conforme al Paso 3 de la Resolución 40595 de 2022 para TransCor S.A.S. Debe incluir: declaración de compromiso de la alta dirección, alcance, objetivos de seguridad vial, principios rectores, responsabilidades por nivel jerárquico y firma del representante legal. ${ctx}`,

  PROCEDIMIENTO_RIESGOS: (ctx) =>
    `Genera el Procedimiento de Gestión y Control de Riesgos Viales (código PR-SV-002) conforme a los Pasos 5, 6 y 7 de la Resolución 40595. Incluye: objetivo, alcance, definiciones, metodología de identificación (GTC-45 adaptada), valoración, controles, seguimiento y formatos asociados. ${ctx}`,

  ACTA_COMITE: (ctx) =>
    `Genera un Acta de Reunión del Comité de Seguridad Vial conforme al Paso 2 de la Resolución 40595. Fecha actual. Incluye: número de acta, asistentes (incluye líder PESV, representante dirección, conductor, mantenimiento), orden del día (revisión indicadores, seguimiento compromisos, nuevos temas), desarrollo de cada punto, compromisos con responsables y fechas, y firmas. ${ctx}`,

  PROGRAMA_RIESGOS_CRITICOS: (ctx) =>
    `Genera el Programa de Gestión de Riesgos Críticos (código PG-SV-001) conforme al Paso 8 de la Resolución 40595. Incluye: introducción, riesgos críticos identificados con nivel alto y muy alto, medidas de intervención por riesgo, cronograma de implementación, indicadores de seguimiento y responsables. ${ctx}`,

  INDICADORES_PASO20: (ctx) =>
    `Genera la ficha completa de indicadores del PESV conforme al Paso 20 de la Resolución 40595 de 2022. Incluye los 13 indicadores oficiales con: nombre, fórmula de cálculo, unidad de medida, frecuencia de medición, meta, responsable y fuente de datos. Presenta en formato de tabla. ${ctx}`,

  INFORME_EJECUTIVO: (ctx) =>
    `Genera un Informe Ejecutivo mensual del estado del PESV de TransCor S.A.S. Incluye: resumen ejecutivo, estado de indicadores principales, avance por módulo del PESV (24 pasos), incidentes del período, hallazgos de inspecciones vehiculares, estado de capacitaciones, compromisos pendientes, conclusiones y recomendaciones de la dirección. ${ctx}`,

  POLITICA_SGSST: (ctx) =>
    `Genera la Política integrada de Seguridad y Salud en el Trabajo (SG-SST) y Seguridad Vial para TransCor S.A.S., conforme al Decreto 1072 de 2015 y la Resolución 40595 de 2022. Debe incluir: 1) Declaración del compromiso de la dirección con la seguridad vial y SST, 2) Alcance de la política sobre conductores, vehículos y rutas, 3) Objetivos integrados PESV-SG-SST, 4) Responsabilidades del Comité de Seguridad Vial y el COPASST, 5) Mecanismos de control de riesgos viales como parte del panorama de riesgos SST, 6) Indicadores de gestión integrados (accidentalidad, ausentismo, capacitaciones), 7) Compromisos de mejora continua. Citar artículos específicos del Decreto 1072 y la Resolución 40595. ${ctx}`,
};

const getModel = () => genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PESV,
});

const generarDocumento = async (tipo, contextoExtra = "") => {
  const promptFn = PROMPTS[tipo];
  if (!promptFn) throw new Error(`Tipo de documento desconocido: ${tipo}`);

  const model = getModel();
  const result = await model.generateContent(promptFn(contextoExtra));
  return result.response.text();
};

const investigarIncidente = async (incidente) => {
  const prompt = `Analiza el siguiente incidente vial y genera un Informe de Investigación formal conforme al Paso 13 de la Resolución 40595 de 2022:

Tipo: ${incidente.tipo}
Fecha: ${new Date(incidente.fecha).toLocaleDateString("es-CO")}
Lugar: ${incidente.lugar}${incidente.municipio ? `, ${incidente.municipio}` : ""}
Conductor: ${incidente.conductor?.usuario?.nombre || "No identificado"}
Vehículo: ${incidente.vehiculo?.placa || "No identificado"} ${incidente.vehiculo?.marca || ""} ${incidente.vehiculo?.modelo || ""}
Descripción: ${incidente.descripcion}
Lesionados: ${incidente.lesionados}
Muertos: ${incidente.muertos}
Severidad: ${incidente.severidad}
Costo estimado: ${incidente.costoEstimado ? `$${incidente.costoEstimado.toLocaleString("es-CO")}` : "No determinado"}

El informe debe incluir obligatoriamente: 1) Descripción cronológica del evento, 2) Causas directas, 3) Causas básicas o raíz, 4) Factores contribuyentes, 5) Consecuencias reales y potenciales, 6) Acciones correctivas y preventivas propuestas con responsables y fechas, 7) Lecciones aprendidas.`;

  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const consultaNormativa = async (historial) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PESV,
  });

  const contents = historial.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = contents.pop();
  const chat = model.startChat({ history: contents });
  const result = await chat.sendMessage(lastMessage.parts[0].text);
  return result.response.text();
};

const generarInformeEjecutivo = async (contexto) => {
  return generarDocumento("INFORME_EJECUTIVO", contexto);
};

module.exports = { generarDocumento, investigarIncidente, consultaNormativa, generarInformeEjecutivo };
