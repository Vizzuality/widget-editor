import { find } from "lodash";

import { Dataset, Widget, Config } from "@widget-editor/types";

export default class WidgetService implements Widget.Service {
  config: Config.Payload;

  constructor(config: Config.Payload) {
    this.config = config;
  }

  fromDataset(dataset: Dataset.Payload): Widget.Payload {
    return find(
      dataset.attributes?.widget,
      (widget) => !!widget.attributes.defaultEditableWidget
    );
  }

  async fetchWidget(url: string): Promise<Widget.Payload> {
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
