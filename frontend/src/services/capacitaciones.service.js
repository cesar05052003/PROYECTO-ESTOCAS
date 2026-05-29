import api from "./api";
export const getCapacitaciones = () => api.get("/capacitaciones");
export const getParticipantes = (id) => api.get(`/capacitaciones/${id}/participantes`);
export const inscribir = (id, data) => api.post(`/capacitaciones/${id}/inscribir`, data);
export const evaluar = (id, data) => api.post(`/capacitaciones/${id}/evaluar`, data);
export const crearCapacitacion = (data) => api.post("/capacitaciones", data);
