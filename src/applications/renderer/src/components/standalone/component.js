import React, { Suspense } from "react";

import useWidgetData from "./fetch-data-hook";

const Chart = React.lazy(() => import("../chart"));

const Standalone = ({ widgetConfig, adapter, theme }) => {
  const [{ data, isLoading, isError }] = useWidgetData(widgetConfig, theme);

  if (isLoading) {
    return "Loading...";
  }

  if (isError) {
    return "Error loading widget...";
  }

  return (
    <Suspense>
      <Chart standalone standaloneConfiguration={data} />
    </Suspense>
  );
};

export default Standalone;
