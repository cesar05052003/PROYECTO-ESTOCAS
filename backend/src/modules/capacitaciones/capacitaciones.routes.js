const { Router } = require("express");
const {
  listar,
  participantes,
  inscribir,
  evaluar,
  crear,
  misCapacitaciones,
  obtenerCapacitacion,
  enviarRespuestas,
  agregarPregunta,
  generarCertificado,
  eliminarCapacitacion,
  registrarAsistencia,
  listarAsistencia,
} = require("./capacitaciones.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/", listar);
router.get("/mis-capacitaciones", misCapacitaciones);
router.post("/", crear);
router.get("/:id", obtenerCapacitacion);
router.get("/:id/participantes", participantes);
router.post("/:id/inscribir", inscribir);
router.post("/:id/evaluar", evaluar);
router.post("/enviar-respuestas", enviarRespuestas);
router.post("/preguntas", agregarPregunta);
router.post("/certificado/:usuarioCapacitacionId", generarCertificado);
router.get("/:id/asistencia", listarAsistencia);
router.post("/:id/asistencia", registrarAsistencia);
router.delete("/:id", eliminarCapacitacion);

module.exports = router;
