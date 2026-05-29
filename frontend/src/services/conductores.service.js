import api from "./api";
export const getConductores = (params) => api.get("/conductores", { params });
export const getConductor = (id) => api.get(`/conductores/${id}`);
export const crearConductor = (data) => api.post("/conductores", data);
export const actualizarConductor = (id, data) => api.put(`/conductores/${id}`, data);
