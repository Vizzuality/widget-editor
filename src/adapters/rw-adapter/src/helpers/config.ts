import { pick } from "lodash";

import { Config } from "@widget-editor/types";

class ConfigHelper implements Config.Service {
  config: Config.Payload;

  constructor(params: Config.Payload) {
    this.setConfig(params);
  }

  setConfig(params: Config.Payload): void {
    const acceptedParams = pick(params, [
      "endpoint",
      "env",
      "applications",
      "locale",
      "userToken",
    ]);
    this.config = { ...this.config, ...acceptedParams };
  }

  getConfig(): Config.Payload {
    return this.config;
  }
}

export default (params: Config.Payload): Config.Service => {
  return new ConfigHelper(params);
};
