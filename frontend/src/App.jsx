import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./router/index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documentos from "./pages/Documentos";
import Riesgos from "./pages/Riesgos";
import Capacitaciones from "./pages/Capacitaciones";
import Vehiculos from "./pages/Vehiculos";
import Conductores from "./pages/Conductores";
import Incidentes from "./pages/Incidentes";
import AsistenteIA from "./pages/AsistenteIA";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/riesgos" element={<Riesgos />} />
          <Route path="/capacitaciones" element={<Capacitaciones />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/conductores" element={<Conductores />} />
          <Route path="/incidentes" element={<Incidentes />} />
          <Route path="/asistente" element={<AsistenteIA />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
