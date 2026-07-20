const express = require("express");
const {
  readContent,
  writeContent,
  generateReadableId,
} = require("../utils/contentStore");
const { requireAdminAuth } = require("../utils/adminAuth");
const { findItemIndexById, reorderItemsByIds } = require("../utils/contentHelpers");
const { validateSkillPayload } = require("../utils/contentValidators");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const content = await readContent();
    return res.json(content.skills);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to read skills.",
      error: error.message,
    });
  }
});

router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateSkillPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const newSkill = {
      id: generateReadableId("skills", content.skills),
      name: req.body.name.trim(),
      imageUrl: typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "",
      createdAt: new Date().toISOString(),
    };

    content.skills.push(newSkill);
    await writeContent(content);

    return res.status(201).json(newSkill);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create skill.",
      error: error.message,
    });
  }
});

router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateSkillPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const skillIndex = findItemIndexById(content.skills, req.params.id);

    if (skillIndex === -1) {
      return res.status(404).json({
        message: `Skill '${req.params.id}' was not found.`,
      });
    }

    const existingSkill = content.skills[skillIndex];
    const updatedSkill = {
      ...existingSkill,
      name: req.body.name.trim(),
      imageUrl: typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "",
    };

    content.skills[skillIndex] = updatedSkill;
    await writeContent(content);

    return res.json(updatedSkill);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update skill.",
      error: error.message,
    });
  }
});

router.post("/reorder", requireAdminAuth, async (req, res) => {
  try {
    const content = await readContent();
    const reorderedSkills = reorderItemsByIds(content.skills, req.body.itemIds);

    if (!reorderedSkills) {
      return res.status(400).json({
        message: "itemIds must include every skill id exactly once.",
      });
    }

    content.skills = reorderedSkills;
    await writeContent(content);

    return res.json(content.skills);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reorder skills.",
      error: error.message,
    });
  }
});

router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const content = await readContent();
    const skillIndex = findItemIndexById(content.skills, req.params.id);

    if (skillIndex === -1) {
      return res.status(404).json({
        message: `Skill '${req.params.id}' was not found.`,
      });
    }

    const deletedSkill = content.skills[skillIndex];
    content.skills.splice(skillIndex, 1);
    await writeContent(content);

    return res.json({
      message: `Skill '${req.params.id}' deleted successfully.`,
      deletedItem: deletedSkill,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete skill.",
      error: error.message,
    });
  }
});

module.exports = router;
