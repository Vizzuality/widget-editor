import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import Input from "styles-common/input";
import Select from "components/select";

const StyledContainer = styled.div`
  margin: 10px;
  flex-basis: 100%;
  padding: 10px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
`;

const QueryValues = ({
  theme,
  value,
  columns,
  configuration,
  patchConfiguration
}) => {
  const handleChange = selectedOption => {
    // TODO: Wee need to set type here
    patchConfiguration({
      value: {
        ...configuration.value,
        name: selectedOption.identifier,
        alias: selectedOption.alias
      }
    });
  };

  return (
    <FlexContainer>
      <StyledContainer>
        <Select
          menuPlacement="top"
          defaultValue={value}
          onChange={handleChange}
          getOptionLabel={option => option.alias}
          getOptionValue={option => option.identifier}
          options={columns}
          isCustom
        />
      </StyledContainer>
    </FlexContainer>
  );
};

export default QueryValues;
