module.exports = items => {
    return items.reduce((map, item) => map.set(item, (map.get(item) || 0) + 1), new Map());
}