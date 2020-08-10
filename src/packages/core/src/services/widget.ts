import { find } from "lodash";

import { Widget, Adapter } from "@widget-editor/types";

export default class WidgetService implements Widget.Service {
  adapter: Adapter.Service;

  constructor(adapter: Adapter.Service) {
    this.adapter = adapter;
  }

  async fetchWidget(url: string): Promise<Widget.Payload> {
    try {
      const response = await this.adapter.prepareRequest(url);
      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
