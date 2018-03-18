module.exports = (array, splitter) => {
    return array.reduce((result, item) => {
      const lastSubArray = result[result.length - 1];

      (splitter(lastSubArray, item)
        ? result[result.push([]) - 1]
        : lastSubArray).push(item)

      return result;
    }, [[]]);
}