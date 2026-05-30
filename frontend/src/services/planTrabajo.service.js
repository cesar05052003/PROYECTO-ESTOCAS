import api from "./api";
export const getPlanes = () => api.get("/plan-trabajo");
export const getPlan = (anio) => api.get(`/plan-trabajo/${anio}`);
export const crearPlan = (data) => api.post("/plan-trabajo", data);
export const actualizarPlan = (id, data) => api.put(`/plan-trabajo/${id}`, data);
