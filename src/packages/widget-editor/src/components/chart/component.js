import React, { useEffect, useRef } from "react";
import * as vega from "vega";

import ChartTheme from "helpers/theme";

const Chart = ({ editor, widget }) => {
  const chart = useRef();

  useEffect(() => {
    if (chart.current && widget) {
      const runtime = vega.parse(widget);
      new vega.View(runtime)
        .initialize(chart.current)
        .renderer("canvas")
        .hover()
        .run();
    }
  }, [chart, editor, widget]);

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
