const { Router } = require("express");
const { listar, matriz, crear, actualizar } = require("./riesgos.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.use(verifyToken);
router.get("/matriz", matriz);
router.get("/", listar);
router.post("/", crear);
router.put("/:id", actualizar);

module.exports = router;
