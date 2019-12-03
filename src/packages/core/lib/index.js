"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rw_adapter_1 = require("@packages/rw-adapter");
function core(message) {
    const adapter = new rw_adapter_1.default();
    adapter.print();
}
exports.default = core;
//# sourceMappingURL=index.js.map