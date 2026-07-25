const apiApp = require("../backend/expressApp");

function toSinglePathSegment(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join("/");
  }

  return typeof value === "string" ? value : "";
}

module.exports = (req, res) => {
  const route = toSinglePathSegment(req.query.route);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query || {})) {
    if (key === "route") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, item);
      }
      continue;
    }

    if (value !== undefined) {
      searchParams.append(key, value);
    }
  }

  req.url = `/${route}${searchParams.toString() ? `?${searchParams}` : ""}`;
  return apiApp(req, res);
};
