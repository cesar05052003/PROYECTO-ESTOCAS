import api from "./api";
export const getEmergencias = () => api.get("/emergencias");
export const crearEmergencia = (data) => api.post("/emergencias", data);
export const actualizarEmergencia = (id, data) => api.put(`/emergencias/${id}`, data);
