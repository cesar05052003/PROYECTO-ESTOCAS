const { Router } = require("express");
const { listar, participantes, inscribir, evaluar, crear } = require("./capacitaciones.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/", listar);
router.post("/", crear);
router.get("/:id/participantes", participantes);
router.post("/:id/inscribir", inscribir);
router.post("/:id/evaluar", evaluar);

module.exports = router;
