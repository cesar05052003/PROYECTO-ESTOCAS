import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./router/index";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documentos from "./pages/Documentos";
import Riesgos from "./pages/Riesgos";
import Capacitaciones from "./pages/Capacitaciones";
import Vehiculos from "./pages/Vehiculos";
import Conductores from "./pages/Conductores";
import Usuarios from "./pages/Usuarios";
import Incidentes from "./pages/Incidentes";
import AsistenteIA from "./pages/AsistenteIA";
import Comite from "./pages/Comite";
import Diagnostico from "./pages/Diagnostico";
import PlanTrabajo from "./pages/PlanTrabajo";
import Emergencias from "./pages/Emergencias";
import Desplazamientos from "./pages/Desplazamientos";
import Auditoria from "./pages/Auditoria";
import MejoraContinua from "./pages/MejoraContinua";
import Reportes from "./pages/Reportes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Planificación */}
          <Route path="/comite" element={<Comite />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/riesgos" element={<Riesgos />} />
          {/* Implementación */}
          <Route path="/plan-trabajo" element={<PlanTrabajo />} />
          <Route path="/capacitaciones" element={<Capacitaciones />} />
          <Route path="/emergencias" element={<Emergencias />} />
          <Route path="/incidentes" element={<Incidentes />} />
          <Route path="/desplazamientos" element={<Desplazamientos />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/conductores" element={<Conductores />} />
          <Route path="/usuarios" element={<Usuarios />} />
          {/* Seguimiento */}
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/auditoria" element={<Auditoria />} />
          {/* Mejora Continua */}
          <Route path="/mejora-continua" element={<MejoraContinua />} />
          {/* IA */}
          <Route path="/asistente" element={<AsistenteIA />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
