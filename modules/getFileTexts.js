const fs = require('fs');

module.exports = path =>
    !fs.statSync(path).isDirectory()
        ? [fs.readFileSync(path)]
        : fs.readdirSync(path)
            .map(name => module.exports(path + '/' + name));