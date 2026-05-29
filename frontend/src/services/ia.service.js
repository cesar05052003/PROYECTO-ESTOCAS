import api from "./api";
export const generarDocumento = (tipo, contexto) => api.post("/ia/generar-documento", { tipo, contexto });
export const consultaNormativa = (historial) => api.post("/ia/consulta-normativa", { historial });
export const investigarIncidente = (incidenteId) => api.post(`/ia/investigar-incidente/${incidenteId}`);
export const generarInformeEjecutivo = (contexto) => api.post("/ia/generar-informe-ejecutivo", { contexto });
