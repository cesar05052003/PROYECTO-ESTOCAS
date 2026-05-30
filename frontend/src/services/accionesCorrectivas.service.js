import api from "./api";
export const getAcciones = () => api.get("/acciones-correctivas");
export const crearAccion = (data) => api.post("/acciones-correctivas", data);
export const actualizarAccion = (id, data) => api.put(`/acciones-correctivas/${id}`, data);
export const cerrarAccion = (id, data) => api.post(`/acciones-correctivas/${id}/cerrar`, data);
