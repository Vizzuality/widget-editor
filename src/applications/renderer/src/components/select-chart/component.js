import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
            isDisabled={true}
            onChange={handleChange}
            onMenuOpen={() => setIsOpenMenu(true)}
            onMenuClose={() => setIsOpenMenu(false)}
            value={{ value: "custom", label: "Custom chart" }}
            options={[{ value: "custom", label: "Custom chart" }]}
            styles={InputStyles}
            components={{ Menu: ChartMenu }}
            menuIsOpen={isOpenMenu}
          />
        </StyledSelectBox>
      )}

      {!advanced && (
        <StyledSelectBox isCompact={isCompact || forceCompact}>
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
