import api from "./api";
export const getMantenimientos = (vehiculoId) => api.get("/mantenimientos", { params: vehiculoId ? { vehiculoId } : {} });
export const crearMantenimiento = (data) => api.post("/mantenimientos", data);
export const actualizarMantenimiento = (id, data) => api.put(`/mantenimientos/${id}`, data);
