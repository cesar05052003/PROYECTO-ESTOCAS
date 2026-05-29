import api from "./api";
export const getRiesgos = (params) => api.get("/riesgos", { params });
export const getMatriz = () => api.get("/riesgos/matriz");
export const crearRiesgo = (data) => api.post("/riesgos", data);
export const actualizarRiesgo = (id, data) => api.put(`/riesgos/${id}`, data);
