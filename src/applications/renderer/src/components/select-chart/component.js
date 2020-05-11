import React, { useState, useEffect } from "react";
import find from "lodash/find";
import filter from "lodash/filter";
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
  rasterOnly,
  disabledFeatures,
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

  const filterOutDisabledCharts = filter(
    options,
    (o) => disabledFeatures.indexOf(o.value) === -1
  );

  return (
    <StyledContainer
      rasterOnly={rasterOnly}
      isCompact={isCompact || forceCompact}
    >
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

      {!advanced && !rasterOnly && (
        <StyledSelectBox isCompact={isCompact || forceCompact}>
          <Select
            onChange={handleChange}
            onMenuOpen={() => setIsOpenMenu(true)}
            onMenuClose={() => setIsOpenMenu(false)}
            value={selected}
            options={filterOutDisabledCharts}
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

export default SelectChart;
