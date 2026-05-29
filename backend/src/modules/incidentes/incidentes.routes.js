const { Router } = require("express");
const { listar, estadisticas, crear, actualizar } = require("./incidentes.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/estadisticas", estadisticas);
router.get("/", listar);
router.post("/", crear);
router.put("/:id", actualizar);

module.exports = router;
