
const asker = require('./ask');
const flatTree = require('./flatTree');
const makeFileArrayTree = require('./makeFileArrayTree');

module.exports = async (path, extraOptions = []) => { //1 because 0 is rootName
    const options = [...extraOptions, ...makeFileArrayTree(path)[1]]; 
    console.log('Выберите файл:');
    const answer = await asker(options);
    return flatTree(options, answer, 0, 1);
}