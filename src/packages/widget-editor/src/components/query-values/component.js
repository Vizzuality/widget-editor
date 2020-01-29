import React, { useState, useEffect } from "react";
import Select from "react-select";
import styled from "styled-components";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import Input from "styles-common/input";

const StyledContainer = styled.div`
  margin: 10px;
  flex-basis: 100%;
  padding: 10px;
`;

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  })
};

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
          styles={InputStyles}
        />
      </StyledContainer>
    </FlexContainer>
  );
};

export default QueryValues;
