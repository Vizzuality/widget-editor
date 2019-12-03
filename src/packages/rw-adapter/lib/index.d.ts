import Say from "@packages/types";
export default class RwAdapter implements Say {
    message: string;
    constructor(m: string);
    print(): String;
}
