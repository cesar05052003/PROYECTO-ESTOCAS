import api from "./api";
export const getVehiculos = (params) => api.get("/vehiculos", { params });
export const getVehiculo = (id) => api.get(`/vehiculos/${id}`);
export const getAlertas = () => api.get("/vehiculos/alertas");
export const crearVehiculo = (data) => api.post("/vehiculos", data);
export const actualizarVehiculo = (id, data) => api.put(`/vehiculos/${id}`, data);
