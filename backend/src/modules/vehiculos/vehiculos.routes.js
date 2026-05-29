const { Router } = require("express");
const { listar, obtener, alertas, crear, actualizar } = require("./vehiculos.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/alertas", alertas);
router.get("/", listar);
router.get("/:id", obtener);
router.post("/", crear);
router.put("/:id", actualizar);

module.exports = router;
