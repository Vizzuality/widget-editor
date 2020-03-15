import React, { useState, useRef } from "react";
import find from "lodash/find";
import Select from "react-select";
import ChartMenu from "./components/ChartMenu";
import {
  StyledContainer,
  InputStyles,
  StyledOverflow,
} from "./style";

const SelectChart = ({ patchConfiguration, options, chartType, direction }) => {
  const [selected, setSelected] = useState(find(options, { chartType, direction }));
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef({});

  const handleChange = option => {
    const { chartType, direction } = option;
    patchConfiguration({ chartType, direction });
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <StyledContainer>
      <Select
        onChange={handleChange}
        onMenuOpen={() => setIsOpen(true)}
        value={selected}
        options={options}
        styles={InputStyles}
        components={ { Menu: ChartMenu } }
        innerRef={ref}
        menuIsOpen={isOpen}
      />
      {isOpen && (
        <StyledOverflow onClick={() => setIsOpen(false)} />
      )}
    </StyledContainer>
  );
};

export default SelectChart;
