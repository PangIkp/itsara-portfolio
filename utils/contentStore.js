const fs = require("fs/promises");
const path = require("path");

const contentFilePath = path.join(__dirname, "..", "data", "content.json");

const defaultContent = {
  projects: [],
  certificates: [],
  activities: [],
  skills: [],
};

async function readContent() {
  const file = await fs.readFile(contentFilePath, "utf8");
  const parsedContent = JSON.parse(file);

  return {
    ...defaultContent,
    ...parsedContent,
  };
}

async function writeContent(content) {
  const normalizedContent = {
    ...defaultContent,
    ...content,
  };

  await fs.writeFile(
    contentFilePath,
    JSON.stringify(normalizedContent, null, 2),
    "utf8"
  );
}

function generateReadableId(collection, items) {
  const prefixMap = {
    projects: "project",
    certificates: "certificate",
    activities: "activity",
    skills: "skill",
  };

  const prefix = prefixMap[collection] || "item";
  const maxNumber = items.reduce((currentMax, item) => {
    const match = typeof item.id === "string"
      ? item.id.match(new RegExp(`^${prefix}-(\\d+)$`))
      : null;

    if (!match) {
      return currentMax;
    }

    const itemNumber = Number.parseInt(match[1], 10);
    return Number.isNaN(itemNumber) ? currentMax : Math.max(currentMax, itemNumber);
  }, 0);

  return `${prefix}-${String(maxNumber + 1).padStart(3, "0")}`;
}

module.exports = {
  readContent,
  writeContent,
  generateReadableId,
  defaultContent,
  contentFilePath,
};
