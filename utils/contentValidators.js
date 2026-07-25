function validateRequiredTextFields(payload, requiredFields) {
  return requiredFields.filter((field) => {
    const value = payload[field];
    return typeof value !== "string" || value.trim() === "";
  });
}

function validateOptionalImagePath(imageUrl, expectedPrefix, collectionLabel) {
  if (typeof imageUrl !== "string") {
    return {
      isValid: false,
      message: "imageUrl must be a string when provided.",
    };
  }

  const trimmedImageUrl = imageUrl.trim();

  if (trimmedImageUrl === "") {
    return {
      isValid: true,
    };
  }

  const isExternalUrl = /^https?:\/\/\S+/i.test(trimmedImageUrl);

  if (isExternalUrl) {
    return {
      isValid: true,
    };
  }

  if (!trimmedImageUrl.startsWith(expectedPrefix)) {
    return {
      isValid: false,
      message: `imageUrl must start with '${expectedPrefix}' or be a valid http/https URL for ${collectionLabel} items.`,
    };
  }

  return {
    isValid: true,
  };
}

function validateProjectPayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "title",
    "description",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return validateOptionalImagePath(payload.imageUrl, "/images/projects/", "project");
}

function validateCertificatePayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "title",
    "description",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return validateOptionalImagePath(payload.imageUrl, "/images/certificates/", "certificate");
}

function validateActivityPayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "title",
    "description",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return validateOptionalImagePath(payload.imageUrl, "/images/activities/", "activity");
}

function validateSkillPayload(payload) {
  const missingFields = validateRequiredTextFields(payload, [
    "name",
  ]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return validateOptionalImagePath(payload.imageUrl, "/images/skills/", "skill");
}

module.exports = {
  validateProjectPayload,
  validateCertificatePayload,
  validateActivityPayload,
  validateSkillPayload,
};
