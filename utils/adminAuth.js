const crypto = require("crypto");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const sessionStore = new Map();
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function isAdminAuthConfigured() {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);
}

function createAdminSession() {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  sessionStore.set(token, { expiresAt });
  return token;
}

function removeExpiredSession(token) {
  const session = sessionStore.get(token);

  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    sessionStore.delete(token);
    return null;
  }

  return session;
}

function getBearerToken(authorizationHeader = "") {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return "";
  }

  return authorizationHeader.slice("Bearer ".length).trim();
}

function validateAdminCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

function requireAdminAuth(req, res, next) {
  if (!isAdminAuthConfigured()) {
    return res.status(503).json({
      message: "Admin authentication is not configured.",
    });
  }

  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      message: "Admin login is required.",
    });
  }

  const session = removeExpiredSession(token);

  if (!session) {
    return res.status(401).json({
      message: "Admin session is invalid or expired.",
    });
  }

  req.adminSession = session;
  req.adminToken = token;
  return next();
}

function logoutAdminSession(token) {
  if (!token) {
    return;
  }

  sessionStore.delete(token);
}

function hasValidAdminSession(token) {
  return Boolean(removeExpiredSession(token));
}

module.exports = {
  isAdminAuthConfigured,
  createAdminSession,
  getBearerToken,
  validateAdminCredentials,
  requireAdminAuth,
  logoutAdminSession,
  hasValidAdminSession,
};
