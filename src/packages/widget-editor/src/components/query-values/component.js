import React, { Fragment } from "react";
import Select from "components/select";

const QueryValues = ({
  columns,
  configuration,
  patchConfiguration
}) => {
  const { 
    title,
    category_title,
    category: {
      alias: categoryAlias, 
      name: categoryName 
    },
    value: {
      alias: valueAlias,
      name: valueName
    }
  } = configuration
  const verticalValue = { 
    alias: categoryAlias || category_title || valueName, 
    name: categoryName 
  };
  const horizontalValue = { 
    alias: valueAlias || title || valueName, 
    name: valueName 
  };
  const handleChangeVertical = selectedOption => {
    // TODO: Wee need to set type here
    patchConfiguration({
      category: {
        ...configuration.category,
        ...selectedOption,
      }
    });
  };
  const handleChangeHorizontal = selectedOption => {
    // TODO: Wee need to set type here
    patchConfiguration({
      value: {
        ...configuration.value,
        ...selectedOption
      }
    });
  };

  return (
    <Fragment>
      <Select
        align="vertical"
        menuPlacement="top"
        defaultValue={verticalValue}
        onChange={handleChangeVertical}
        getOptionLabel={option => option.alias}
        getOptionValue={option => option.identifier}
        options={columns}
        configuration={configuration}
        isCustom
        isPopup
      />
      <Select
        align="horizontal"
        menuPlacement="top"
        defaultValue={horizontalValue}
        onChange={handleChangeHorizontal}
        getOptionLabel={option => option.alias}
        getOptionValue={option => option.identifier}
        options={columns}
        configuration={configuration}
        isCustom
        isPopup
      />
    </Fragment>
  );
};

export default QueryValues;
