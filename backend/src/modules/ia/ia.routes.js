const { Router } = require("express");
const { generarDocumento, consultaNormativa, investigarIncidente, generarInformeEjecutivo } = require("./ia.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.post("/generar-documento", generarDocumento);
router.post("/consulta-normativa", consultaNormativa);
router.post("/investigar-incidente/:incidenteId", investigarIncidente);
router.post("/generar-informe-ejecutivo", generarInformeEjecutivo);

module.exports = router;
