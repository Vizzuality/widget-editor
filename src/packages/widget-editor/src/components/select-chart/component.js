import React, { useState, useEffect, useRef } from "react";
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import Select from "react-select";
import ChartMenu from "./components/ChartMenu";
import {
  StyledContainer,
  InputStyles,
  StyledOverflow,
} from "./style";

const SelectChart = ({ patchConfiguration, options, value }) => {
  const [selected, setSelected] = useState(find(options, { value }));
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef({});

  useEffect(() => {
    // TODO: optimize...
    if (!isEqual(find(options, { value }), selected)) {
      setSelected(find(options, { value }));
    }
  }, [selected, value]);

  const handleChange = option => {
    patchConfiguration({ chartType: option.value, direction: option.direction });
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
