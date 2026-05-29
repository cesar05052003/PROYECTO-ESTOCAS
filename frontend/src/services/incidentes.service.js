import api from "./api";
export const getIncidentes = (params) => api.get("/incidentes", { params });
export const getEstadisticas = () => api.get("/incidentes/estadisticas");
export const crearIncidente = (data) => api.post("/incidentes", data);
export const actualizarIncidente = (id, data) => api.put(`/incidentes/${id}`, data);
