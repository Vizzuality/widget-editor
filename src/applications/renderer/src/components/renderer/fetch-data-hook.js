import find from 'lodash/find';
import { useState, useEffect } from "react";

function getDataUrl(data) {
  if (!data) return null;
  return find(data, 'url')?.url
}

const useWidgetData = (widgetConfig, isMap) => {
  const [dataURL] = useState(getDataUrl(widgetConfig?.data));
  const [widgetData, setData] = useState(null);
  const [isLoadingWidgetData, setIsLoading] = useState(false);
  const [isErrorData, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const request = await fetch(dataURL);
        const { data } = await request.json();
        setData(data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    if (!isMap && dataURL) {
      fetchData();
    }
  }, [dataURL, isMap]);
  return { widgetData, dataURL, isLoadingWidgetData, isErrorData };
};

export default useWidgetData;
