const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./middlewares/errorHandler");

// Rutas
const authRoutes = require("./modules/auth/auth.routes");
const usuariosRoutes = require("./modules/usuarios/usuarios.routes");
const conductoresRoutes = require("./modules/conductores/conductores.routes");
const vehiculosRoutes = require("./modules/vehiculos/vehiculos.routes");
const documentosRoutes = require("./modules/documentos/documentos.routes");
const riesgosRoutes = require("./modules/riesgos/riesgos.routes");
const capacitacionesRoutes = require("./modules/capacitaciones/capacitaciones.routes");
const incidentesRoutes = require("./modules/incidentes/incidentes.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const iaRoutes = require("./modules/ia/ia.routes");
const comiteRoutes = require("./modules/comite/comite.routes");
const diagnosticoRoutes = require("./modules/diagnostico/diagnostico.routes");
const planTrabajoRoutes = require("./modules/plan-trabajo/planTrabajo.routes");
const emergenciasRoutes = require("./modules/emergencias/emergencias.routes");
const desplazamientosRoutes = require("./modules/desplazamientos/desplazamientos.routes");
const mantenimientosRoutes = require("./modules/mantenimientos/mantenimientos.routes");
const accionesCorrectivasRoutes = require("./modules/acciones-correctivas/accionesCorrectivas.routes");
const reporteAutogestionRoutes = require("./modules/reporte-autogestion/reporteAutogestion.routes");
const auditoriaRoutes = require("./modules/auditoria/auditoria.routes");

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", app: "PESV Digital", version: "1.0.0" }));

// Módulos
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/conductores", conductoresRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/riesgos", riesgosRoutes);
app.use("/api/capacitaciones", capacitacionesRoutes);
app.use("/api/incidentes", incidentesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ia", iaRoutes);
app.use("/api/comite", comiteRoutes);
app.use("/api/diagnostico", diagnosticoRoutes);
app.use("/api/plan-trabajo", planTrabajoRoutes);
app.use("/api/emergencias", emergenciasRoutes);
app.use("/api/desplazamientos", desplazamientosRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use("/api/acciones-correctivas", accionesCorrectivasRoutes);
app.use("/api/reporte-autogestion", reporteAutogestionRoutes);
app.use("/api/auditoria", auditoriaRoutes);

app.use(errorHandler);

module.exports = app;
