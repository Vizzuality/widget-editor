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

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err);
    }
  }
}
