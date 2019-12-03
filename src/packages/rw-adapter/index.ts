import Say from "@packages/types";

export default class RwAdapter implements Say {
  message: string;
  constructor(m: string) {
    this.message = m || "Hello world";
  }
  print(): String {
    return this.message;
  }
}
