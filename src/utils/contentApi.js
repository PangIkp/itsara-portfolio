const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

export async function deleteContentItem(collection, id) {
  const response = await fetch(`${API_BASE_URL}/api/${collection}/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response);
}
