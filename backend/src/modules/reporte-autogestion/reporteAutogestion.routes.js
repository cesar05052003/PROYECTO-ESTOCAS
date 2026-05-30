const { Router } = require("express");
const { listar, obtener, generar } = require("./reporteAutogestion.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const router = Router();
router.use(verifyToken);
router.get("/", listar);
router.get("/:anio/:mes", obtener);
router.post("/generar", generar);
module.exports = router;
