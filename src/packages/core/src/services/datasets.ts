import { Dataset, Config } from "@packages/types";

export default class DatasetService implements Dataset {
  datasetId: string;
  config: Config;

  constructor(datasetId: string, config: Config) {
    this.datasetId = datasetId;
    this.config = config;
  }

  async fetchData(includes: string | "", applications: [String] | [""]) {
    const { url, env, locale } = this.config.getConfig();
    try {
      const response = await fetch(
        `${url}/dataset/${this.datasetId}?application=${applications.join(
          ","
        )}&env=${env}&language=${locale}&includes=${includes}&page[size]=999`
      );

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err);
    }
  }
}
