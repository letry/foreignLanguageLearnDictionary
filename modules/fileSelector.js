
const fs = require('fs');
const pathParser = require('path').parse;
const asker = require('./ask');
const flatTree = require('./flatTree');

module.exports = async (path, dopOptions = []) => { //1 because 0 is rootName
    const options = [...dopOptions, ...makeFileArrayTree(path)[1]]; 
    console.log('Выберите файл:');
    const answer = await asker(options);
    return flatTree(options, answer, 0, 1);
}

const makeFileArrayTree = path => {
    const isFile = !fs.statSync(path).isDirectory();
    const {name, ext} = pathParser(path);
    const toConcat = isFile ? [] : [fs.readdirSync(path)
      .map(name => makeFileArrayTree(path + '/' + name))];
      
    return [name + ext, ...toConcat];
}