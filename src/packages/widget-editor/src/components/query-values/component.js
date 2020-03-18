import React, { Fragment } from "react";
import styled from "styled-components";

import FlexContainer from "styles-common/flex";
import Select from "components/select";

const StyledContainer = styled.div`
  margin: 10px;
  flex-basis: 100%;
  padding: 10px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const QueryValues = ({
  // value,
  columns,
  configuration,
  patchConfiguration
}) => {
  const { 
    category: { 
      alias: categoryAlias, 
      name: categoryName 
    }, 
    value: { 
      alias: valueAlias, 
      name: valueName
    } 
  } = configuration
  const verticalValue = { alias: categoryAlias, name: categoryName };
  const horizontalValue = { alias: valueAlias, name: valueName };
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
