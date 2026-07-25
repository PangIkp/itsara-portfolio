const fs = require("fs/promises");
const path = require("path");
const { get, put } = require("@vercel/blob");

const contentFilePath = path.join(__dirname, "..", "data", "content.json");
const blobContentPath = "content/content.json";

const defaultContent = {
  projects: [],
  certificates: [],
  activities: [],
  skills: [],
};

function shouldUseBlobStore() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

function normalizeContent(content) {
  return {
    ...defaultContent,
    ...content,
  };
}

async function readLocalContent() {
  const file = await fs.readFile(contentFilePath, "utf8");
  return normalizeContent(JSON.parse(file));
}

async function writeBlobContent(content) {
  const normalizedContent = normalizeContent(content);

  await put(blobContentPath, JSON.stringify(normalizedContent, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });

  return normalizedContent;
}

async function readContent() {
  if (!shouldUseBlobStore()) {
    return readLocalContent();
  }

  const blobResult = await get(blobContentPath, {
    access: "private",
    useCache: false,
  });

  if (!blobResult) {
    const seededContent = await readLocalContent();
    await writeBlobContent(seededContent);
    return seededContent;
  }

  const blobText = await new Response(blobResult.stream).text();
  const parsedContent = JSON.parse(blobText);

  return normalizeContent(parsedContent);
}

async function writeContent(content) {
  const normalizedContent = normalizeContent(content);

  if (shouldUseBlobStore()) {
    await writeBlobContent(normalizedContent);
    return;
  }

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
