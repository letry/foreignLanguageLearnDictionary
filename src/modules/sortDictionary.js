const fs = require('fs');

const ascending = [[() => 1], [() => -1]];

module.exports = [
    ({byValue, ascending}) => {
        const dictionary = JSON.parse(fs.readFileSync(global.dictionary));
        const entries = Object.entries(dictionary);
        const mapper = val => +val[+byValue]//If is a string then compare by char code
            ? +val[+byValue] : val[+byValue].toString().charCodeAt();
        
        entries.sort((prev, next) => {
            const [prevVal, nextVal] = [prev, next].map(mapper);
            return (prevVal - nextVal) * ascending;
        });

        const result = entries.reduce((result, [key, value]) => Object.assign(result, {[key]: value}), {});
        fs.writeFileSync(global.dictionary, JSON.stringify(result, null, '\t'));
    },
    [
        [ascending => ({ byValue: false, ascending}), ascending],
        [ascending => ({ byValue: true, ascending}), ascending],
    ]
];