const get = require('lodash.get');

module.exports = (tree, path, ...args) => {
    const [selection, children] = args.map(localPath => get(tree[path[0]], localPath));
    return [selection, ...(!children ? [] : module.exports(children, path.slice(1), ...args))];
}