import React, { useState, useEffect } from "react";
import find from "lodash/find";
import { Button } from "@widget-editor/shared";
import Select from "react-select";
import ChartMenu from "./components/ChartMenu";
import {
  StyledContainer,
  StyledSelectBox,
  InputStyles,
  StyledOverflow,
} from "./style";

/**
 * FIXME
 * Open menu requires a dark background StyledOverflow.
 * To make it works we need to set the menu open value to redux.
 * And display StyledOverflow in core application container.
 * {isOpenMenu && < onClick={() => setIsOpenMenu(false)} />}
 */

const NON_DIRECTIONAL_CHARTS = ['pie', 'scatter', 'map'];

const isNonDirectionalChart = chart => {
  return NON_DIRECTIONAL_CHARTS.indexOf(chart) > -1;
}

const SelectChart = ({
  patchConfiguration,
  options,
  chartType,
  direction,
  theme,
  setTheme,
}) => {
  const [selected, setSelected] = useState(
    find(options, isNonDirectionalChart(chartType) ? { chartType } : { chartType, direction })
  );

  useEffect(() => {
    if (selected && selected.chartType !== chartType) {
      setSelected(find(options, isNonDirectionalChart(chartType) ? { chartType } : { chartType, direction }));
    }
  }, [chartType, selected, direction, options]);

  const {
    compact: { isCompact, isOpen },
  } = theme;
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleChange = (option) => {
    const { chartType, direction } = option;
    patchConfiguration({ chartType, direction });
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
