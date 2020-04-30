import React, { Fragment, useState, useEffect } from "react";
import { Select } from "@widget-editor/shared";

import { resolveLabel } from "./utils";

const ColumnSelections = ({
  compact,
  columns,
  configuration,
  patchConfiguration,
}) => {
  const { chartType, xAxisTitle, yAxisTitle } = configuration;

  const categoryName = configuration?.category?.name || null;
  const valueName = configuration?.value?.name || null;

  const selectedValue = valueName
    ? columns.find((col) => col.identifier === valueName)
    : null;
  const selectedCategory = categoryName
    ? columns.find((col) => col.identifier === categoryName)
    : null;

  const [xTitle, setXTitle] = useState(xAxisTitle);
  const [yTitle, setYTitle] = useState(yAxisTitle);

  const [chartOptions, setChartOptions] = useState({
    chartValue: selectedValue,
    chartCategory: selectedCategory,
  });

  useEffect(() => {
    if (xAxisTitle !== xTitle) {
      setXTitle(xAxisTitle);
    }
    if (yAxisTitle !== yTitle) {
      setYTitle(yAxisTitle);
    }
  }, [xAxisTitle, yAxisTitle, xTitle, yTitle]);

  useEffect(() => {
    const valueIdentifier = configuration?.value?.name;
    const categoryIdentifier = configuration?.category?.name;
    const selectedValue = valueIdentifier
      ? [...columns].find((col) => col.name === valueIdentifier)
      : null;
    const selectedCategory = categoryIdentifier
      ? [...columns].find((col) => col.name === categoryIdentifier)
      : null;

    setChartOptions({
      chartValue: selectedValue,
      chartCategory: selectedCategory,
    });
  }, [configuration, columns]);

  const handleChangeCategory = (selectedOption) => {
    // TODO: Wee need to set type here
    patchConfiguration({
      category: {
        ...configuration.category,
        ...selectedOption,
      },
    });
  };
  const handleChangeValue = (selectedOption) => {
    // TODO: Wee need to set type here
    patchConfiguration({
      value: {
        ...configuration.value,
        ...selectedOption,
      },
    });
  };

  const reverse =
    ["bar", "line", "scatter", "stacked-bar"].indexOf(chartType) > -1;
  const isPieOrDonut = chartType === "pie" || chartType === "donut";

  return (
    <Fragment>
      {isPieOrDonut && (
        <Select
          align="horizontal"
          menuPlacement="top"
          compact={compact}
          value={chartOptions.chartValue}
          onChange={handleChangeValue}
          getOptionLabel={(option) => resolveLabel(xTitle, option)}
          getOptionValue={(option) => option.identifier}
          options={columns}
          configuration={configuration}
          isCustom
          isPopup
        />
      )}

      {/* -- Vertical select column */}

      {!isPieOrDonut && (
        <Fragment>
          {!reverse && (
            <Select
              align="vertical"
              menuPlacement="top"
              value={chartOptions.chartCategory}
              onChange={handleChangeCategory}
              getOptionLabel={(option) => resolveLabel(yTitle, option)}
              getOptionValue={(option) => option.identifier}
              options={columns}
              configuration={configuration}
              isCustom
              isPopup
            />
          )}

          {reverse && (
            <Select
              align="vertical"
              menuPlacement="top"
              value={chartOptions.chartValue}
              onChange={handleChangeValue}
              getOptionLabel={(option) => resolveLabel(xTitle, option)}
              getOptionValue={(option) => option.identifier}
              options={columns}
              configuration={configuration}
              isCustom
              isPopup
            />
          )}

          {/* -- END Vertical select column */}

          {/* -- Horizontal select column */}

          {chartType !== "pie" && !reverse && (
            <Select
              align="horizontal"
              compact={compact}
              menuPlacement="top"
              value={chartOptions.chartValue}
              onChange={handleChangeValue}
              getOptionLabel={(option) => resolveLabel(xTitle, option)}
              getOptionValue={(option) => option.identifier}
              options={columns}
              configuration={configuration}
              isCustom
              isPopup
            />
          )}

          {chartType !== "pie" && reverse && (
            <Select
              align="horizontal"
              compact={compact}
              menuPlacement="top"
              value={chartOptions.chartCategory}
              onChange={handleChangeCategory}
              getOptionLabel={(option) => resolveLabel(yTitle, option)}
              getOptionValue={(option) => option.identifier}
              options={columns}
              configuration={configuration}
              isCustom
              isPopup
            />
          )}

          {/* -- END Horizontal select column */}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ColumnSelections;
