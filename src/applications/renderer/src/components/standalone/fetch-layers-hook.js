import { useState, useEffect, useMemo } from "react";

const useLayerData = (adapter, layerId, isMap) => {
  const [layerData, setData] = useState(null);

  const [isLoadingLayers, setIsLoading] = useState(false);
  const [isErrorLayers, setIsError] = useState(false);

  const adapterInstance = useMemo(() => new adapter(), [adapter]);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const data = await adapterInstance.getLayer(layerId);
        setData(data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    if (isMap) {
      fetchData();
    }
  }, [adapterInstance, layerId, isMap]);

  return { layerData, isLoadingLayers, isErrorLayers };
};

export default useLayerData;
