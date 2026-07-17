const express = require("express");
const { readContent } = require("../utils/contentStore");

const router = express.Router();

router.get("/content", async (req, res) => {
  try {
    const content = await readContent();
    return res.json(content);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to read content data.",
      error: error.message,
    });
  }
});

router.get("/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const content = await readContent();

    if (!(collection in content)) {
      return res.status(404).json({
        message: `Collection '${collection}' was not found.`,
      });
    }

    return res.json(content[collection]);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to read content collection.",
      error: error.message,
    });
  }
});

module.exports = router;
