import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import find from "lodash/find";

import { Button, Select } from "@widget-editor/shared";

import ChartMenu from "./components/ChartMenu";
import { StyledContainer, StyledSelectBox } from "./style";

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
  advanced,
  setTheme,
}) => {
  const [selected, setSelected] = useState(find(options, { chartType }));

  useEffect(() => {
    if (selected && selected.chartType !== chartType) {
      setSelected(find(options, { chartType }));
    }
  }, [chartType, selected, options]);

  const {
    compact: { isCompact, forceCompact, isOpen },
  } = theme;
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleChange = (option) => {
    const { chartType } = option;
    patchConfiguration({
      chartType,
      visualizationType: chartType === "map" ? "map" : "chart",
    });
    setSelected(option);
    setIsOpenMenu(false);
  };

  const hadleSettings = () => {
    setTheme({
      ...theme,
      compact: { isCompact, forceCompact, isOpen: !isOpen },
    });
  };

  return (
    <StyledContainer isCompact={isCompact || forceCompact}>
      {advanced && (
        <StyledSelectBox isCompact={isCompact || forceCompact}>
          <Select
            id="renderer-visualization-type"
            aria-label="Select a visualization type"
            options={[{ value: "custom", label: "Custom chart" }]}
            value={{ value: "custom", label: "Custom chart" }}
            onChange={handleChange}
            menuIsOpen={isOpenMenu}
            components={{ Menu: ChartMenu }}
            disabled={true}
            onMenuOpen={() => setIsOpenMenu(true)}
            onMenuClose={() => setIsOpenMenu(false)}
          />
        </StyledSelectBox>
      )}

      {!advanced && (
        <StyledSelectBox isCompact={isCompact || forceCompact}>
          <Select
            id="renderer-visualization-type"
            aria-label="Select a visualization type"
            options={options}
            value={selected}
            onChange={handleChange}
            menuIsOpen={isOpenMenu}
            components={{ Menu: ChartMenu }}
            onMenuOpen={() => setIsOpenMenu(true)}
            onMenuClose={() => setIsOpenMenu(false)}
          />
        </StyledSelectBox>
      )}
      {(isCompact || forceCompact) && (
        <Button btnType="highlight" onClick={() => hadleSettings()}>
          Settings
        </Button>
      )}
    </StyledContainer>
  );
};

SelectChart.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

export default SelectChart;
