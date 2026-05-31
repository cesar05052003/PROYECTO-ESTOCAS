const { Router } = require("express");
const { kpis, accidentalidad, alertasRecientes, cumplimiento, costos, marcarAlertaLeida } = require("./dashboard.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/kpis", kpis);
router.get("/accidentalidad", accidentalidad);
router.get("/alertas", alertasRecientes);
router.get("/cumplimiento", cumplimiento);
router.get("/costos", costos);
router.patch("/alertas/:id/leer", marcarAlertaLeida);

module.exports = router;
