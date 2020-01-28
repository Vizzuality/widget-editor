import React from "react";
import styled from "styled-components";
import find from "lodash/find";

import Select from "react-select";

const StyledContainer = styled.div`
  margin: 10px;
`;

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  }),
  option: base => ({
    ...base
  })
};

const SelectChart = ({ patchConfiguration, options, value }) => {
  const handleChange = option => {
    console.log("handle change", patchConfiguration);
    patchConfiguration({ chartType: option.value });
  };

  return (
    <StyledContainer>
      <Select
        onChange={handleChange}
        defaultValue={find(options, { value })}
        options={options}
        styles={InputStyles}
      />
    </StyledContainer>
  );
};

export default SelectChart;
