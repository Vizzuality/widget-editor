import { find } from "lodash";

import { Widget, Config } from "@packages/types";

export default class WidgetService implements Widget {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  fromDataset(dataset: any) {
    return find(
      dataset.attributes.widget,
      widget => !!widget.attributes.defaultEditableWidget
    );
  }

  async fetchWidget(url: string) {
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
