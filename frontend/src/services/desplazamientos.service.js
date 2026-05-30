import api from "./api";
export const getDesplazamientos = () => api.get("/desplazamientos");
export const crearDesplazamiento = (data) => api.post("/desplazamientos", data);
export const actualizarDesplazamiento = (id, data) => api.put(`/desplazamientos/${id}`, data);
