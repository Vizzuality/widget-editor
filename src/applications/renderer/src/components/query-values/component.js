import React, { Fragment, useState, useEffect } from "react";
import { Select } from "@widget-editor/shared";

const QueryValues = ({
  compact,
  columns,
  configuration,
  patchConfiguration,
}) => {
  const { chartType, xAxisTitle, yAxisTitle } = configuration;

  const categoryName = configuration?.category?.name || null;
  const valueName = configuration?.value?.name || null;

  const selectedValue = columns.find((col) => col.identifier === valueName);
  const selectedCategory = columns.find(
    (col) => col.identifier === categoryName
  );

  const [chartOptions, setChartOptions] = useState({
    chartValue: selectedValue,
    chartCategory: selectedCategory,
  });

  useEffect(() => {
    const valueName = configuration?.value?.name || null;
    const categoryName = configuration?.category?.name || null;

    const selectedValue = columns.find((col) => col.identifier === valueName);
    const selectedCategory = columns.find(
      (col) => col.identifier === categoryName
    );

    setChartOptions({
      chartValue: selectedValue,
      chartCategory: selectedCategory,
    });
  }, [configuration]);

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

  return (
    <Fragment>
      {chartType === "pie" && (
        <Select
          align="horizontal"
          menuPlacement="top"
          compact={compact}
          value={chartOptions.chartValue}
          onChange={handleChangeValue}
          getOptionLabel={(option) => (yAxisTitle ? yAxisTitle : option.alias)}
          getOptionValue={(option) => option.identifier}
          options={columns}
          configuration={configuration}
          isCustom
          isPopup
        />
      )}
      {chartType !== "pie" && (
        <Select
          align="vertical"
          menuPlacement="top"
          value={chartOptions.chartValue}
          onChange={handleChangeCategory}
          getOptionLabel={(option) => (yAxisTitle ? yAxisTitle : option.alias)}
          getOptionValue={(option) => option.identifier}
          options={columns}
          configuration={configuration}
          isCustom
          isPopup
        />
      )}
      {chartType !== "pie" && (
        <Select
          align="horizontal"
          compact={compact}
          menuPlacement="top"
          value={chartOptions.chartCategory}
          onChange={handleChangeValue}
          getOptionLabel={(option) => (xAxisTitle ? xAxisTitle : option.alias)}
          getOptionValue={(option) => option.identifier}
          options={columns}
          configuration={configuration}
          isCustom
          isPopup
        />
      )}
    </Fragment>
  );
};

export default QueryValues;
