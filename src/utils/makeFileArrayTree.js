
const pathParser = require('path').parse;
const fs = require('fs');

module.exports = path => {
    const isFile = !fs.statSync(path).isDirectory();
    const {name, ext} = pathParser(path);
    const toConcat = isFile ? [] : [
      fs.readdirSync(path)
      .filter(name => name[0] !== '.') //exclude hidden files
      .map(name => module.exports(path + '/' + name))
    ];
      
    return [name + ext, ...toConcat];
}