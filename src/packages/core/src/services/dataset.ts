import { Dataset, Config, Payloads } from "@packages/types";

export default class DatasetService implements Dataset {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async fetchData(url: string): Promise<[Payloads.Dataset]> {
    try {
      const response = await fetch(url);

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err);
    }
  }
}
