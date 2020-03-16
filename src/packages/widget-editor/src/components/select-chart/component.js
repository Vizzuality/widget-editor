import React, { useState, useRef } from "react";
import find from "lodash/find";
import Button from "components/button";
import Select from "react-select";
import ChartMenu from "./components/ChartMenu";
import {
  StyledContainer,
  StyledSelectBox,
  InputStyles,
  StyledOverflow,
} from "./style";

const SelectChart = ({ patchConfiguration, options, chartType, direction, theme, setTheme }) => {
  const [selected, setSelected] = useState(find(options, { chartType, direction }));
  const { compact: { isCompact, isOpen } } = theme;
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const ref = useRef({});

  const handleChange = option => {
    const { chartType, direction } = option;
    patchConfiguration({ chartType, direction });
    setSelected(option);
    setIsOpenMenu(false);
  };

  const hadleSettings = () => {
    setTheme({...theme, compact: { isCompact, isOpen: !isOpen }})
  }

  return (
    <StyledContainer>
      <StyledSelectBox isCompact={isCompact}>
        <Select
          onChange={handleChange}
          onMenuOpen={() => setIsOpenMenu(true)}
          value={selected}
          options={options}
          styles={InputStyles}
          components={ { Menu: ChartMenu } }
          innerRef={ref}
          menuIsOpen={isOpenMenu}
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
      {isOpenMenu && (
        <StyledOverflow onClick={() => setIsOpenMenu(false)} />
      )}
    </StyledContainer>
  );
};

export default SelectChart;
