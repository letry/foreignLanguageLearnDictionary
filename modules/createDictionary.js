const fs = require('fs');
const ask = require('./askPromise');

module.exports = [async () => {
    const dirname = `${__dirname}/../dictionaries`;
    const answer = await ask('Введите название нового словаря: ');
    fs.writeFileSync(`${dirname}/${answer}.json`, '{}');
    console.log('Словарь создан');
}];