const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");

router.post("/signup", auth.signup).post("/login", auth.login);

exports.router = router;
