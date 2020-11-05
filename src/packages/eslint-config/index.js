// We simply include our root eslint config and extend it for each package
// We keep a root config so we don't have to change it in multiple places
// This package is simply used to give linting capability locally when developing
const eslintConf = require("../../../.eslintrc.json");
module.exports = eslintConf;
