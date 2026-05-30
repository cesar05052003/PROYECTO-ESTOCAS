import api from "./api";
export const getAuditorias = () => api.get("/auditoria");
export const crearAuditoria = (data) => api.post("/auditoria", data);
export const actualizarAuditoria = (id, data) => api.put(`/auditoria/${id}`, data);
export const getInforme = (id) => api.get(`/auditoria/${id}/informe`);
