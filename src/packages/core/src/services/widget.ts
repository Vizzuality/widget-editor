import { find } from "lodash";

import { Widget, Config, Payloads } from "@packages/types";

import getQueryByFilters from "../sql/getQueryByFilters";

export default class WidgetService implements Widget {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  fromDataset(dataset: Payloads.Dataset): Payloads.Widget {
    return find(
      dataset.attributes.widget,
      widget => !!widget.attributes.defaultEditableWidget
    );
  }

  getDataSqlQuery(dataset: Payloads.Dataset, widget: Payloads.Widget): string {
    const { provider, tableName } = dataset.attributes;
    // tableName: string,
    // provider: string,
    // filters = [],
    // arrColumns = [],
    // arrOrder = [],
    // sortOrder: string = "asc"

    let query: string = getQueryByFilters(tableName, provider);
    return `${query} LIMIT 10`;
  }

  async fetchWidgetData(url: string): Promise<[object]> {
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

  async fetchWidget(url: string): Promise<Payloads.Widget> {
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
