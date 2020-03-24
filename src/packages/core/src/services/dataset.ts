import { Dataset, Config } from "@packages/types";

export default class DatasetService implements Dataset.Service {
  config: Config.Payload;

  constructor(config: Config.Payload) {
    this.config = config;
  }

  async fetchData(url: string): Promise<[Dataset.Payload]> {
    try {
      const response = await fetch(url);

      if (response.status >= 400) {
        throw new Error(response.statusText);
        return {};
      }

      return await response.json();
    } catch (err) {
      console.error("Error loading dataset:", url);
      return {};
    }
  }
}
