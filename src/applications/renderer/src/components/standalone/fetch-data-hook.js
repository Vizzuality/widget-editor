import { useState, useEffect } from "react";

import {
  FiltersService,
  constants,
  VegaService,
  StateProxy,
} from "@widget-editor/core";

const useWidgetData = (widgetConfig, theme) => {
  const [data, setData] = useState(null);
  const [dataURL, setDataURL] = useState(widgetConfig?.data?.[0]?.url);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const request = await fetch(dataURL);
        const { data } = await request.json();
        const vega = new VegaService(
          widgetConfig,
          data,
          widgetConfig.paramsConfig
        );

        setData(vega.getChart());
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return [{ data, isLoading, isError }, setDataURL];
};

export default useWidgetData;
