import api from "./api";

export const getUsuarios = () => api.get("/usuarios");
export const getUsuarioPorId = (id) => api.get(`/usuarios/${id}`);
export const crearUsuario = (data) => api.post("/usuarios", data);
export const actualizarUsuario = (id, data) => api.put(`/usuarios/${id}`, data);
export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);
