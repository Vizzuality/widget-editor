import { useState, useEffect } from "react";

const useWidgetData = (widgetConfig, theme, isMap) => {
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
        setData(data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    if (!isMap) {
      fetchData();
    }
  }, []);
  return [{ data, isLoading, isError }, setDataURL];
};

export default useWidgetData;
