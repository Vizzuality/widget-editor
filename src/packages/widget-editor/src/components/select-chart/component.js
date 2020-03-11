import React, { useState, useEffect } from "react";
import find from "lodash/find";
import isEqual from "lodash/isEqual";
import Button from "components/button";
import Select from "react-select";
import { StyledContainer, StyledSelectBox, InputStyles } from './style';


const SelectChart = ({ patchConfiguration, options, value, theme, setTheme }) => {
  const [selected, setSelected] = useState(find(options, { value }));
  const { compact: { isCompact, isOpen } } = theme;
  useEffect(() => {
    // TODO: optimize...
    if (!isEqual(find(options, { value }), selected)) {
      setSelected(find(options, { value }));
    }
  }, [selected, value]);

  const handleChange = option => {
    patchConfiguration({ chartType: option.value });
  };

  const hadleSettings = () => {
    setTheme({...theme, compact: { isCompact, isOpen: !isOpen }})
  }

  return (
    <StyledContainer isCompact={isCompact}>
      <StyledSelectBox isCompact={isCompact}>
        <Select
          onChange={handleChange}
          value={selected}
          options={options}
          styles={InputStyles}
        />
      </StyledSelectBox>
      {isCompact && (
        <Button
          type="highlight"
          onClick={()=> hadleSettings()}
        >
          Settings
        </Button>
      )}
    </StyledContainer>
  );
};

export default SelectChart;
