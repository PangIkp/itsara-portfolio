function findItemIndexById(items, id) {
  return items.findIndex((item) => item.id === id);
}

module.exports = {
  findItemIndexById,
};
