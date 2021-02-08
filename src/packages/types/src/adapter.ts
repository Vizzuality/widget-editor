import * as Dataset from "./dataset";
import * as Widget from "./widget";
import * as Layer from "./layer";

export type Area = {
  id: string | null,
  name: string
};

export interface Service {
  /**
   * Return the name of the adapter
   */
  getName(): string;
  /**
   * Get the definition of a dataset
   * @param datasetId Dataset ID
   */
  getDataset(datasetId: Dataset.Id): Promise<Dataset.Payload>;
  /**
   * Get a dataset's fields
   * @param datasetId Dataset ID
   * @param dataset The dataset's definition
   */
  getDatasetFields(datasetId: Dataset.Id, dataset: Dataset.Payload): Promise<Dataset.Field[]>;
  /**
   * Get a dataset's data after performing a SQL query on it
   * @param datasetId Dataset ID
   * @param sql SQL query
   */
  getDatasetData(
    datasetId: Dataset.Id,
    sql: string,
    options?: {
      /**
       * Additional parameters needed to retrieve the data
       */
      extraParams?: {
        geostore?: string;
      },
      /**
       * Indicate the URL of the data must be saved.
       * It may be serialised in the widget config at a later point.
       */
      saveDataUrl?: boolean
    }
  ): Promise<Dataset.Data>;
  /**
   * Get the URL of the data.
   * To be not null, getDatasetData must have been previously called with the third param.
   */
  getDataUrl(): string | null;
  /**
   * Get a dataset's layers
   * @param datasetId Dataset ID
   */
  getDatasetLayers(datasetId: Dataset.Id): Promise<Layer.Payload[]>;
  /**
   * Get the definition of a widget
   * @param widgetId Widget ID
   */
  getWidget(widgetId: Widget.Id): Promise<Widget.Payload>;
  /**
   * Get the definition of a layer
   * @param layerId Layer ID
   */
  getLayer(layerId: Layer.Id): Promise<Layer.Payload>;
  /**
   * Get the list of predefined areas that can be used as a geographic filter
   */
  getPredefinedAreas(): Promise<Area[]>;
  /**
   * Get the list of the user's custom areas that can be used as a geographic filter
   */
  getUserAreas(): Promise<Area[]>;
  /**
   * Overwrite the adapter's own properties.
   * Useful to configure the adapter with other default configuration variables.
   */
  extendProperties(props: { [key: string]: unknown }): void;
  /**
   * Tell the adapter to abort any requests, if any
   */
  abortRequests(): void;
}
