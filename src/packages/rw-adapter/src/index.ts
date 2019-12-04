import { Adapter } from "@packages/types";

import ConfigHelper from "./helpers/config";

export default class RwAdapter implements Adapter {
  config = null;
  constructor(params: object | {}) {
    this.config = ConfigHelper(params);
  }
  getDataset() {
    return null;
  }
  getWidget() {
    return null;
  }
}
