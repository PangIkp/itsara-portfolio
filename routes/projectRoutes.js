const express = require("express");
const {
  readContent,
  writeContent,
  generateReadableId,
} = require("../utils/contentStore");
const { requireAdminAuth } = require("../utils/adminAuth");
const { findItemIndexById } = require("../utils/contentHelpers");
const { validateProjectPayload } = require("../utils/contentValidators");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const content = await readContent();
    return res.json(content.projects);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to read projects.",
      error: error.message,
    });
  }
});

router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateProjectPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const newProject = {
      id: generateReadableId("projects", content.projects),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      tools: typeof req.body.tools === "string" ? req.body.tools.trim() : "",
      link: typeof req.body.link === "string" ? req.body.link.trim() : "",
      imageUrl: req.body.imageUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    content.projects.push(newProject);
    await writeContent(content);

    return res.status(201).json(newProject);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create project.",
      error: error.message,
    });
  }
});

router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const validation = validateProjectPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const content = await readContent();
    const projectIndex = findItemIndexById(content.projects, req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({
        message: `Project '${req.params.id}' was not found.`,
      });
    }

    const existingProject = content.projects[projectIndex];
    const updatedProject = {
      ...existingProject,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      tools: typeof req.body.tools === "string" ? req.body.tools.trim() : "",
      link: typeof req.body.link === "string" ? req.body.link.trim() : "",
      imageUrl: req.body.imageUrl.trim(),
    };

    content.projects[projectIndex] = updatedProject;
    await writeContent(content);

    return res.json(updatedProject);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update project.",
      error: error.message,
    });
  }
});

router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const content = await readContent();
    const projectIndex = findItemIndexById(content.projects, req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({
        message: `Project '${req.params.id}' was not found.`,
      });
    }

    const deletedProject = content.projects[projectIndex];
    content.projects.splice(projectIndex, 1);
    await writeContent(content);

    return res.json({
      message: `Project '${req.params.id}' deleted successfully.`,
      deletedItem: deletedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete project.",
      error: error.message,
    });
  }
});

module.exports = router;
