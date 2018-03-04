const intFace = require('readline')
    .createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
module.exports = str => new Promise(resolve => 
    intFace.question(str, answer => resolve(answer)));