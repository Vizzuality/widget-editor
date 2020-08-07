import { Dataset, Adapter } from "@widget-editor/types";

export default class DatasetService implements Dataset.Service {
  adapter: Adapter.Service;

  constructor(adapter: Adapter.Service) {
    this.adapter = adapter;
  }

  async fetchData(url: string): Promise<any> {
    try {
      const response = await this.adapter.prepareRequest(url);
      return response.data;
    } catch (err) {
      return {};
    }
  }
}
