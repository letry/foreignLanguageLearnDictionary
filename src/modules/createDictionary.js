const fs = require('fs');
const ask = require('../utils/askPromise');

module.exports = [async () => {
    const answer = await ask('Введите название нового словаря: ');
    fs.writeFileSync(`${global.paths.dictionaries}/${answer}.json`, '{}');
    console.log('Словарь создан');
}];