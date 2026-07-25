const express = require("express");
const {
  createAdminSession,
  getBearerToken,
  hasValidAdminSession,
  isAdminAuthConfigured,
  logoutAdminSession,
  validateAdminCredentials,
} = require("../utils/adminAuth");

const router = express.Router();

router.post("/login", (req, res) => {
  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      message: "Admin authentication is not configured.",
    });
  }

  const { username, password } = req.body;

  if (!validateAdminCredentials(username, password)) {
    return res.status(401).json({
      message: "Invalid admin credentials.",
    });
  }

  const token = createAdminSession();

  return res.json({
    token,
  });
});

router.get("/session", (req, res) => {
  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      message: "Admin authentication is not configured.",
    });
  }

  const token = getBearerToken(req.headers.authorization);

  return res.json({
    authenticated: hasValidAdminSession(token),
  });
});

router.post("/logout", (req, res) => {
  const token = getBearerToken(req.headers.authorization);
  logoutAdminSession(token);

  return res.json({
    success: true,
  });
});

module.exports = router;
