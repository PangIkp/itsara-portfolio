function findItemIndexById(items, id) {
  return items.findIndex((item) => item.id === id);
}

function reorderItemsByIds(items, itemIds) {
  if (!Array.isArray(itemIds) || itemIds.length !== items.length) {
    return null;
  }

  const itemMap = new Map(items.map((item) => [item.id, item]));
  const reorderedItems = itemIds.map((id) => itemMap.get(id)).filter(Boolean);

  if (reorderedItems.length !== items.length) {
    return null;
  }

  return reorderedItems;
}

module.exports = {
  findItemIndexById,
  reorderItemsByIds,
};
