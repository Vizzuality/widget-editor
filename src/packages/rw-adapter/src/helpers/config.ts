import { pick } from "lodash";

import { Config } from "@packages/types";

class ConfigHelper implements Config {
  config: {
    locale: "en";
  };

  constructor(params: object) {
    this.setConfig(params);
  }

  setConfig(params: object) {
    const acceptedParams = pick(params, [
      "url",
      "env",
      "applications",
      "authUrl",
      "assetsPath",
      "userToken",
      "userEmail",
      "locale"
    ]);
    this.config = { ...this.config, ...acceptedParams };
  }

  getConfig() {
    return this.config;
  }
}

export default (params: object) => {
  return new ConfigHelper(params);
};
