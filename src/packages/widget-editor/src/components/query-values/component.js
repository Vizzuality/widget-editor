import React, { Fragment, useState, useEffect } from "react";
import Select from "components/select";

const QueryValues = ({ columns, configuration, patchConfiguration }) => {
  const {
    chartType,
    xAxisTitle,
    yAxisTitle,
    category: { alias: categoryAlias, name: categoryName },
    value: { alias: valueAlias, name: valueName },
  } = configuration;

  const [chartOptions, setChartOptions] = useState({
    chartValue: {
      alias: xAxisTitle || categoryAlias || categoryName,
      name: categoryName,
    },
    chartCategory: {
      alias: yAxisTitle || valueAlias || valueName,
      name: valueName,
    },
  });

  useEffect(() => {
    const {
      xAxisTitle,
      yAxisTitle,
      category: { alias: categoryAlias, name: categoryName },
      value: { alias: valueAlias, name: valueName },
    } = configuration;
    setChartOptions({
      chartValue: {
        alias: xAxisTitle || categoryAlias || categoryName,
        name: categoryName,
      },
      chartCategory: {
        alias: yAxisTitle || valueAlias || valueName,
        name: valueName,
      },
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
          value={chartOptions.chartValue}
          onChange={handleChangeValue}
          getOptionLabel={(option) => option.alias}
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
          getOptionLabel={(option) => option.alias}
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
          menuPlacement="top"
          value={chartOptions.chartCategory}
          onChange={handleChangeValue}
          getOptionLabel={(option) => option.alias}
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
