function validateRequiredTextFields(payload, requiredFields) {
  return requiredFields.filter((field) => {
    const value = payload[field];
    return typeof value !== "string" || value.trim() === "";
  });
}

function validateProjectPayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "title",
    "description",
    "imageUrl",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  if (!payload.imageUrl.startsWith("/images/projects/")) {
    return {
      isValid: false,
      message: "imageUrl must start with '/images/projects/' for project items.",
    };
  }

  return {
    isValid: true,
  };
}

function validateCertificatePayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "title",
    "description",
    "imageUrl",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  if (!payload.imageUrl.startsWith("/images/certificates/")) {
    return {
      isValid: false,
      message: "imageUrl must start with '/images/certificates/' for certificate items.",
    };
  }

  return {
    isValid: true,
  };
}

function validateActivityPayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "title",
    "description",
    "imageUrl",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  if (!payload.imageUrl.startsWith("/images/activities/")) {
    return {
      isValid: false,
      message: "imageUrl must start with '/images/activities/' for activity items.",
    };
  }

  return {
    isValid: true,
  };
}

module.exports = {
  validateProjectPayload,
  validateCertificatePayload,
  validateActivityPayload,
};
