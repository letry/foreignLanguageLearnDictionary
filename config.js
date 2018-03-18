const workingDirPath = `${__dirname}/work`;

global.dictionaryName = `default.json`;
global.paths = {
  dictionaries: `${workingDirPath}/dictionaries`,
  output: `${workingDirPath}/outputText`,  
  input: `${workingDirPath}/inputTexts`
};

Object.defineProperty(global, 'dictionary', {
  get: () => `${global.paths.dictionaries}/${global.dictionaryName}`
})