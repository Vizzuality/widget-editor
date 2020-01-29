import React, { useState, useEffect } from "react";
import styled from "styled-components";
import find from "lodash/find";
import isEqual from "lodash/isEqual";

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
  const [selected, setSelected] = useState(find(options, { value }));

  useEffect(() => {
    // TODO: optimize...
    if (!isEqual(find(options, { value }), selected)) {
      setSelected(find(options, { value }));
    }
  }, [selected, value]);

  const handleChange = option => {
    patchConfiguration({ chartType: option.value });
  };

  return (
    <StyledContainer>
      <Select
        onChange={handleChange}
        value={selected}
        options={options}
        styles={InputStyles}
      />
    </StyledContainer>
  );
};

export default SelectChart;
