import find from 'lodash/find';
import has from 'lodash/has';
import { useState, useEffect } from "react";

function getDataUrl(data) {
  if (!data) return null;
  return find(data, 'url')?.url
}

function getDataProperty(data) {
  if (!data) return null;
  return find(data, 'url')?.format?.property
}

const useWidgetData = (widgetConfig, isMap) => {
  const [dataURL] = useState(getDataUrl(widgetConfig?.data));
  const [dataProperty] = useState(getDataProperty(widgetConfig?.data));

  const [widgetData, setData] = useState(null);
  const [isLoadingWidgetData, setIsLoading] = useState(false);
  const [isErrorData, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const request = await fetch(dataURL);
        const resp = await request.json();
        if (dataProperty && has(resp, dataProperty)) {
          setData(resp[dataProperty]);
        } else {
          setData(resp);
        }
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    if (!isMap && dataURL) {
      fetchData();
    }
  }, [dataURL, dataProperty, isMap]);
  return { widgetData, dataURL, isLoadingWidgetData, isErrorData };
};

export default useWidgetData;
