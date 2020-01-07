import React, { useEffect, useRef } from "react";
import * as vega from "vega";

import ChartTheme from "helpers/theme";

const Chart = ({ editor }) => {
  const chart = useRef();

  useEffect(() => {
    if (chart.current) {
      const {
        widget: {
          attributes: {
            widgetConfig: { data, scales, marks, legend, config, paramsConfig }
          }
        },
        widgetData
      } = editor;

      const runtime = vega.parse({
        // ...ChartTheme(),
        ...config,
        width: 500,
        height: 250,
        data: widgetData,
        // ...paramsConfig,
        legend
        // scales,
      });

      console.log("parsed config", {
        // ...ChartTheme(),
        ...config,
        width: 500,
        height: 250,
        data: widgetData,
        // ...paramsConfig,
        legend
        // scales,
      });

      new vega.View(runtime)
        .initialize(chart.current)
        .renderer("canvas")
        .hover()
        .run();
    }
  }, [chart, editor]);

  if (!editor.widget) {
    return "Loading...";
  }

  return (
    <div>
      <div ref={chart}></div>
    </div>
  );
};

export default Chart;
