"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RwAdapter {
    constructor() { }
    render(msg) {
        console.log("local", this.message);
        console.log("From prop:", msg);
    }
}
exports.default = RwAdapter;
//# sourceMappingURL=index.js.map