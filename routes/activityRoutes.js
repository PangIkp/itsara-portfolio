const express = require("express");
const {
  readContent,
  writeContent,
  generateReadableId,
} = require("../utils/contentStore");
const { requireAdminAuth } = require("../utils/adminAuth");
const { findItemIndexById } = require("../utils/contentHelpers");
const { validateActivityPayload } = require("../utils/contentValidators");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const content = await readContent();
    return res.json(content.activities);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to read activities.",
      error: error.message,
    });
  }
});

router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateActivityPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const newActivity = {
      id: generateReadableId("activities", content.activities),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      imageUrl: req.body.imageUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    content.activities.push(newActivity);
    await writeContent(content);

    return res.status(201).json(newActivity);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create activity.",
      error: error.message,
    });
  }
});

router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateActivityPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const activityIndex = findItemIndexById(content.activities, req.params.id);

    if (activityIndex === -1) {
      return res.status(404).json({
        message: `Activity '${req.params.id}' was not found.`,
      });
    }

    const existingActivity = content.activities[activityIndex];
    const updatedActivity = {
      ...existingActivity,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      imageUrl: req.body.imageUrl.trim(),
    };

    content.activities[activityIndex] = updatedActivity;
    await writeContent(content);

    return res.json(updatedActivity);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update activity.",
      error: error.message,
    });
  }
});

router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const content = await readContent();
    const activityIndex = findItemIndexById(content.activities, req.params.id);

    if (activityIndex === -1) {
      return res.status(404).json({
        message: `Activity '${req.params.id}' was not found.`,
      });
    }

    const deletedActivity = content.activities[activityIndex];
    content.activities.splice(activityIndex, 1);
    await writeContent(content);

    return res.json({
      message: `Activity '${req.params.id}' deleted successfully.`,
      deletedItem: deletedActivity,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete activity.",
      error: error.message,
    });
  }
});

module.exports = router;
