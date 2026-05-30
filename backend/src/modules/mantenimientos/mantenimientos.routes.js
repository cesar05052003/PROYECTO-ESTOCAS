const { Router } = require("express");
const { listar, crear, actualizar } = require("./mantenimientos.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const router = Router();
router.use(verifyToken);
router.get("/", listar);
router.post("/", crear);
router.put("/:id", actualizar);
module.exports = router;
