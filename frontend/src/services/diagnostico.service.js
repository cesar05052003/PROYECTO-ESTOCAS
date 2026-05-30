import api from "./api";
export const getDiagnosticos = () => api.get("/diagnostico");
export const getDiagnostico = (id) => api.get(`/diagnostico/${id}`);
export const crearDiagnostico = (data) => api.post("/diagnostico", data);
export const actualizarDiagnostico = (id, data) => api.put(`/diagnostico/${id}`, data);
