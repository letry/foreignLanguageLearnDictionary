module.exports = (object, filter) => 
    Object.entries(object)
        .filter(filter)
        .reduce((result, [key, value]) =>
             Object.assign(result, {[key]: value}), {});