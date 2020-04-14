"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class ConfigHelper {
    constructor(params) {
        this.setConfig(params);
    }
    setConfig(params) {
        const acceptedParams = lodash_1.pick(params, [
            "url",
            "env",
            "applications",
            "authUrl",
            "assetsPath",
            "userToken",
            "userEmail",
            "locale"
        ]);
        this.config = Object.assign(Object.assign({}, this.config), acceptedParams);
    }
    getConfig() {
        return this.config;
    }
}
exports.default = (params) => {
    return new ConfigHelper(params);
};
//# sourceMappingURL=config.js.map