const fs = require('fs');
const fileSelector = require('../utils/fileSelector');

module.exports = [
    async () => {
        const selectedPathArr = await fileSelector(global.paths.dictionaries);
        const selectedPath = selectedPathArr.join('/');

        if (selectedPathArr[0] === 'default.json')
            return console.log('Словарь по умолчанию невозможно удалить');
        if (global.dictionaryName === selectedPath)
            return console.log('Текущий словарь невозможно удалить');

        fs.unlinkSync(`${global.paths.dictionaries}/${selectedPath}`);
    }
];