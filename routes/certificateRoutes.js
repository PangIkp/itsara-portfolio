const express = require("express");
const {
  readContent,
  writeContent,
  generateReadableId,
} = require("../utils/contentStore");
const { requireAdminAuth } = require("../utils/adminAuth");
const { findItemIndexById, reorderItemsByIds } = require("../utils/contentHelpers");
const { validateCertificatePayload } = require("../utils/contentValidators");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const content = await readContent();
    return res.json(content.certificates);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to read certificates.",
      error: error.message,
    });
  }
});

router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateCertificatePayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const newCertificate = {
      id: generateReadableId("certificates", content.certificates),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      imageUrl: typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "",
      createdAt: new Date().toISOString(),
    };

    content.certificates.push(newCertificate);
    await writeContent(content);

    return res.status(201).json(newCertificate);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create certificate.",
      error: error.message,
    });
  }
});

router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateCertificatePayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const certificateIndex = findItemIndexById(content.certificates, req.params.id);

    if (certificateIndex === -1) {
      return res.status(404).json({
        message: `Certificate '${req.params.id}' was not found.`,
      });
    }

    const existingCertificate = content.certificates[certificateIndex];
    const updatedCertificate = {
      ...existingCertificate,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      imageUrl: typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "",
    };

    content.certificates[certificateIndex] = updatedCertificate;
    await writeContent(content);

    return res.json(updatedCertificate);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update certificate.",
      error: error.message,
    });
  }
});

router.post("/reorder", requireAdminAuth, async (req, res) => {
  try {
    const content = await readContent();
    const reorderedCertificates = reorderItemsByIds(
      content.certificates,
      req.body.itemIds
    );

    if (!reorderedCertificates) {
      return res.status(400).json({
        message: "itemIds must include every certificate id exactly once.",
      });
    }

    content.certificates = reorderedCertificates;
    await writeContent(content);

    return res.json(content.certificates);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reorder certificates.",
      error: error.message,
    });
  }
});

router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const content = await readContent();
    const certificateIndex = findItemIndexById(content.certificates, req.params.id);

    if (certificateIndex === -1) {
      return res.status(404).json({
        message: `Certificate '${req.params.id}' was not found.`,
      });
    }

    const deletedCertificate = content.certificates[certificateIndex];
    content.certificates.splice(certificateIndex, 1);
    await writeContent(content);

    return res.json({
      message: `Certificate '${req.params.id}' deleted successfully.`,
      deletedItem: deletedCertificate,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete certificate.",
      error: error.message,
    });
  }
});

module.exports = router;
