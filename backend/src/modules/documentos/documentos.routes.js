const { Router } = require("express");
const { listar, obtener, crear, actualizar, eliminar } = require("./documentos.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/", listar);
router.get("/:id", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

module.exports = router;
