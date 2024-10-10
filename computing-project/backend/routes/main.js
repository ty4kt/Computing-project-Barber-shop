const express = require("express");
const AuthController = require("../controllers/AuthController");
const authenticateJWT = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/test", function (req, res) {
  res.send("Test");
});

router.get("/test", authenticateJWT, function (req, res) {
  res.send("Test route accessed by user: " + req.user.username);
});

module.exports = router;
