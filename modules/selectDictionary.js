const fileSelector = require('./fileSelector');

module.exports = [async () => {
    const dirname = `${__dirname}/../dictionaries`;
    const path = await fileSelector(dirname);
    global.dictionary = [dirname, ...path].join('/');
    console.log('Словарь выбран');
}];