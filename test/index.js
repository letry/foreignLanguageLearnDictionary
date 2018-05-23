const fs = require('fs');
require('../index');

const promiseQueue = array => array.reduce((promise, next) => 
    promise.then(next), Promise.resolve());

const write = (message, time = 1000) => new Promise(resolve => {
    global.intFace.write(message + '\n');
    setTimeout(resolve, time);
});

const inputSequence = array => 
    promiseQueue(array.map(([str, delay]) => () => write(str, delay)));

const findInPrompt = message => 
    global.intFace._prompt
        .split(/\d{1}\)/).slice(1)
        .findIndex(str => str.includes(message));

const select = async (firstWrite, text) => {
    await write(firstWrite);
    const index = findInPrompt(text);
    if (!~index) return Promise.reject(`${text} не найден`);
    await write(index);
}

const tests = [{
    name: 'Создание словаря',
    async func() {
        await inputSequence([
            ['1'],
            ['test']
        ]);

        return fs.readdirSync(global.paths.dictionaries).includes('test.json')
            ? Promise.resolve() : Promise.reject('Не создан');
    }
}, {
    name: 'Выбор словаря',
    async func() {
        await select('0', 'test.json');
        return Promise[global.dictionaryName === 'test.json' ? 'resolve' : 'reject']('Не выбран');
    }
}, {
    name: 'Добавление слов',
    async func() {
        await inputSequence([
            ['3'],
            ['1'],
            ['apple cat cat cat dog dog pen', 700]
        ]);
        const dictionary = JSON.parse(fs.readFileSync(global.dictionary));
        
        return dictionary.cat === 3 && dictionary.dog === 2 && dictionary.pen && dictionary.apple
            ? Promise.resolve() : Promise.reject('Слова не добавлены');
    }
}, {
    name: 'Удаление слов',
    async func() {
        await inputSequence([['4'], ['1'], ['pen', 700]]);
        const dictionary = JSON.parse(fs.readFileSync(global.dictionary));
        
        return !dictionary.pen
            ? Promise.resolve() 
            : Promise.reject('Слова не удалены');
    }
}, {
    name: 'Сортировка слов',
    async func() {
        await inputSequence([['5'], ['2'], ['2', 700]]);
        const dictionary = JSON.parse(fs.readFileSync(global.dictionary));
        const keys = Object.keys(dictionary);
        return keys.indexOf('cat') < keys.indexOf('apple') 
            ? Promise.resolve() 
            : Promise.reject('Слова не сортированы');
    }
}, {
    name: 'Фильтрация слов',
    async func() {
        await inputSequence([['6'], ['2'], ['2'], ['2']]);
        const dictionary = JSON.parse(fs.readFileSync(global.dictionary));
        
        return !dictionary.apple
            ? Promise.resolve() 
            : Promise.reject('Слова не фильтрованы');
    }
}, {
    name: 'Перевод',
    async func() {
        await write('7', 1e3);
        const dictionary = JSON.parse(fs.readFileSync(`${global.paths.dictionaries}/testTranslate.json`));
        
        return dictionary.cat === 'кошка' && dictionary.dog === 'собака'
            ? Promise.resolve()
            : Promise.reject('Перевод не получен');
    }
}, {
    name: 'Вывод результата',
    async func() {
        await select('0', 'testTranslate.json');
        if (global.dictionaryName !== 'testTranslate.json') return Promise.reject('Не выбран');

        await inputSequence([['8'], ['1', 700]]);
        const outputHtml = fs.readFileSync(`${global.paths.output}/testTranslate.json.html`).toString();
        
        return outputHtml.includes('кошка') 
            && outputHtml.includes('собака') 
            && outputHtml.match(/table/g).length === 2
            ? Promise.resolve()
            : Promise.reject('Перевод не получен');
    }
}, {
    name: 'Удаление словаря',
    async func() {
        await select('0', 'default.json');
        await select('2', 'test.json');
        await select('2', 'testTranslate.json');

        return !fs.readdirSync(global.paths.dictionaries)
            .find(name => ['test.json', 'testTranslate.json'].includes(name))
            ? Promise.resolve() : Promise.reject('Не удален');
    }
}];

promiseQueue(tests.map(({ name, func }) => {
    const timeEnd = type => data => {
        console.timeEnd(name);
        console[type](type === 'log' ? 'ok' : 'fail', type === 'error' ? data : '', '\n'); 
        return Promise[type === 'log' ? 'resolve' : 'reject'](data);
    };

    return () => new Promise((resolve, reject) => {
        console.time(name);
        //setTimeout(() => reject('timeout'), 700);
        func().then(resolve, reject);
    })
        .then(...['log', 'error'].map(timeEnd));
}))
.then(() => {
    console.log('Все тесты пройдены');
    process.exit(0);
})
.catch(() => {
    console.error('Тесты завершены с ошибкой');
    process.exit(1);
});