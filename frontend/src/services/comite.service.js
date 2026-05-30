import api from "./api";
export const getComite = () => api.get("/comite");
export const crearComite = (data) => api.post("/comite", data);
export const agregarMiembro = (data) => api.post("/comite/miembros", data);
export const eliminarMiembro = (id) => api.delete(`/comite/miembros/${id}`);
export const crearReunion = (data) => api.post("/comite/reuniones", data);
export const getReuniones = () => api.get("/comite/reuniones");
