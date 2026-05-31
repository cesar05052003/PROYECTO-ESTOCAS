const { Router } = require("express");
const { listar, crear, actualizar, eliminar, obtenerPorId } = require("./usuarios.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { checkRole } = require("../../middlewares/roles.middleware");
const router = Router();

router.use(verifyToken);

router.get("/", checkRole(["ADMINISTRADOR"]), listar);
router.post("/", checkRole(["ADMINISTRADOR"]), crear);
router.get("/:id", checkRole(["ADMINISTRADOR"]), obtenerPorId);
router.put("/:id", checkRole(["ADMINISTRADOR"]), actualizar);
router.delete("/:id", checkRole(["ADMINISTRADOR"]), eliminar);

module.exports = router;
