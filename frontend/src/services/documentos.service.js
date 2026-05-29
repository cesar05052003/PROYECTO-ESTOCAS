import api from "./api";
export const getDocumentos = (params) => api.get("/documentos", { params });
export const getDocumento = (id) => api.get(`/documentos/${id}`);
export const crearDocumento = (data) => api.post("/documentos", data);
export const actualizarDocumento = (id, data) => api.put(`/documentos/${id}`, data);
export const eliminarDocumento = (id) => api.delete(`/documentos/${id}`);
