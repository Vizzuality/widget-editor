import { useState, useEffect, useMemo } from "react";
import { FiltersService } from "@widget-editor/core";

const useWidgetData = (adapter, widget, isMap) => {
  const [data, setData] = useState(null);
  const [dataIsEmpty, setDataIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorData, setIsErrorData] = useState(false);

  const adapterInstance = useMemo(() => new adapter(), [adapter]);

  useEffect(() => {
    const fetchData = async () => {
      setIsErrorData(false);
      setIsLoading(true);
      try {
        if (widget) {
          const dataset = await adapterInstance.getDataset(widget?.datasetId);

          // Just tmp, build store so our core filter service can generate widget SQL
          const tmpStore = {
            filters: widget?.widgetConfig?.paramsConfig?.filters,
            configuration: widget?.widgetConfig?.paramsConfig,
            editor: {
              dataset,
            },
            endUserFilters: [] // TODO: Add this
          }

          const filtersService = new FiltersService(tmpStore, adapterInstance);
          const data = await adapterInstance.getDatasetData(widget?.datasetId, filtersService.getQuery())
          setDataIsEmpty(data?.length === 0)
          setData(data);
        }
      } catch (error) {
        setIsErrorData(true);
      }
      setIsLoading(false);
    };
    if (!isMap) {
      fetchData();
    }
  }, []); // eslint-disable-line
  return { data, dataIsEmpty, isLoading, isErrorData };
};

export default useWidgetData;
