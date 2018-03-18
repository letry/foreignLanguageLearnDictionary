const fileSelector = require('../utils/fileSelector');

module.exports = [async () => {
    const dirname = global.paths.dictionaries;
    const path = await fileSelector(dirname);
    global.dictionaryName = path.join('/');
}];