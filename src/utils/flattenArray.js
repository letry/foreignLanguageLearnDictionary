module.exports = arr => {
    const flattened = [].concat(...arr);
    return flattened.some(Array.isArray) ? 
      module.exports(flattened) : flattened;
}