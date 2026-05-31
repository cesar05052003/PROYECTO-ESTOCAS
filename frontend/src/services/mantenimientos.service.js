import api from "./api";
export const getMantenimientos = (vehiculoId) => api.get("/mantenimientos", { params: vehiculoId ? { vehiculoId } : {} });
export const crearMantenimiento = (data) => api.post("/mantenimientos", data);
export const actualizarMantenimiento = (id, data) => api.put(`/mantenimientos/${id}`, data);
export const completarMantenimiento = (id) => api.put(`/mantenimientos/${id}/completar`);
export const getProximosMantenimientos = () => api.get("/mantenimientos/proximos");
export const getEstadisticasMantenimientos = () => api.get("/mantenimientos/estadisticas");
