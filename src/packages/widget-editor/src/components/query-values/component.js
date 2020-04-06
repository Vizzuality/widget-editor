import React, { Fragment } from "react";
import Select from "components/select";

const QueryValues = ({ columns, configuration, patchConfiguration }) => {
  const {
    chartType,
    category: { alias: categoryAlias, name: categoryName },
    value: { alias: valueAlias, name: valueName },
  } = configuration;

  const chartValue = {
    alias: categoryAlias || categoryName,
    name: categoryName,
  };

  const chartCategory = {
    alias: valueAlias || valueName,
    name: valueName,
  };

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
          defaultValue={chartValue}
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
          defaultValue={chartValue}
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
          defaultValue={chartCategory}
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
