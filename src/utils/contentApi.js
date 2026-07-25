const rawApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || "").trim();
const isLocalApiBaseUrl = /^https?:\/\/localhost(?::\d+)?$/i.test(rawApiBaseUrl);
const API_BASE_URL =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  isLocalApiBaseUrl
    ? ""
    : rawApiBaseUrl;
const ADMIN_TOKEN_KEY = "portfolio_admin_token";

function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function buildAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchContentCollection(collection) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${collection}.`);
  }

  return response.json();
}

async function parseJsonResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function createContentItem(collection, payload) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

export async function updateContentItem(collection, id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

export async function deleteContentItem(collection, id) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });

  return parseJsonResponse(response);
}

export async function reorderContentItems(collection, itemIds) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
    body: JSON.stringify({ itemIds }),
  });

  return parseJsonResponse(response);
}

export async function loginAdmin(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await parseJsonResponse(response);
  window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  return data;
}

export async function logoutAdmin() {
  const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
    method: "POST",
    headers: buildAuthHeaders(),
  });

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  return parseJsonResponse(response);
}

export async function verifyAdminSession() {
  const token = getAdminToken();

  if (!token) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/session`, {
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    return false;
  }

  const data = await response.json();

  if (!data.authenticated) {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  }

  return Boolean(data.authenticated);
}
