import React, { useState, useEffect } from "react";
import find from "lodash/find";
import { Button } from "@widget-editor/shared";
import Select from "react-select";
import ChartMenu from "./components/ChartMenu";
import { StyledContainer, StyledSelectBox, InputStyles } from "./style";

/**
 * FIXME
 * Open menu requires a dark background StyledOverflow.
 * To make it works we need to set the menu open value to redux.
 * And display StyledOverflow in core application container.
 * {isOpenMenu && < onClick={() => setIsOpenMenu(false)} />}
 */

const SelectChart = ({
  patchConfiguration,
  options,
  chartType,
  theme,
  setTheme,
}) => {
  const [selected, setSelected] = useState(find(options, { chartType }));

  useEffect(() => {
    if (selected && selected.chartType !== chartType) {
      setSelected(find(options, { chartType }));
    }
  }, [chartType, selected, options]);

  const {
    compact: { isCompact, isOpen },
  } = theme;
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleChange = (option) => {
    const { chartType } = option;
    patchConfiguration({ chartType });
    setSelected(option);
    setIsOpenMenu(false);
  };

  const hadleSettings = () => {
    setTheme({ ...theme, compact: { isCompact, isOpen: !isOpen } });
  };

  return (
    <StyledContainer isCompact={isCompact}>
      <StyledSelectBox isCompact={isCompact}>
        <Select
          onChange={handleChange}
          onMenuOpen={() => setIsOpenMenu(true)}
          onMenuClose={() => setIsOpenMenu(false)}
          value={selected}
          options={options}
          styles={InputStyles}
          components={{ Menu: ChartMenu }}
          menuIsOpen={isOpenMenu}
        />
      </StyledSelectBox>
      {isCompact && (
        <Button type="highlight" onClick={() => hadleSettings()}>
          Settings
        </Button>
      )}
    </StyledContainer>
  );
};

export default SelectChart;
