const intFace = require('readline')
    .createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
global.intFace = intFace;

module.exports = str => new Promise(resolve => 
    intFace.question(str, answer => resolve(answer)));