import { useState, useEffect } from "react";

const useLayerData = (layerId, isMap) => {
  const [layerData, setData] = useState(null);
  const [dataURL, setDataURL] = useState(
    `https://api.resourcewatch.org/v1/layer/${layerId}`
  );

  const [isLoadingLayers, setIsLoading] = useState(false);
  const [isErrorLayers, setIsError] = useState(false);
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
    if (isMap) {
      fetchData();
    }
  }, []);
  return [{ layerData, isLoadingLayers, isErrorLayers }, setDataURL];
};

export default useLayerData;
