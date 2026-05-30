import api from "./api";
export const getReportes = () => api.get("/reporte-autogestion");
export const getReporte = (anio, mes) => api.get(`/reporte-autogestion/${anio}/${mes}`);
export const generarReporte = (data) => api.post("/reporte-autogestion/generar", data);
