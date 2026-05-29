const { Router } = require("express");
const { login, me } = require("./auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, me);

module.exports = router;
