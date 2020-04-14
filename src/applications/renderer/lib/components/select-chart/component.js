import React, { useState, useRef } from "react";
import find from "lodash/find";
import { Button } from "@packages/shared";
import Select from "react-select";
import ChartMenu from "./components/ChartMenu";
import { StyledContainer, StyledSelectBox, InputStyles, StyledOverflow } from "./style";
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
  direction,
  theme,
  setTheme
}) => {
  const [selected, setSelected] = useState(find(options, {
    chartType,
    direction
  }));
  const {
    compact: {
      isCompact,
      isOpen
    }
  } = theme;
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleChange = option => {
    const {
      chartType,
      direction
    } = option;
    patchConfiguration({
      chartType,
      direction
    });
    setSelected(option);
    setIsOpenMenu(false);
  };

  const hadleSettings = () => {
    setTheme({ ...theme,
      compact: {
        isCompact,
        isOpen: !isOpen
      }
    });
  };

  return React.createElement(StyledContainer, {
    isCompact: isCompact
  }, React.createElement(StyledSelectBox, {
    isCompact: isCompact
  }, React.createElement(Select, {
    onChange: handleChange,
    onMenuOpen: () => setIsOpenMenu(true),
    onMenuClose: () => setIsOpenMenu(false),
    value: selected,
    options: options,
    styles: InputStyles,
    components: {
      Menu: ChartMenu
    },
    menuIsOpen: isOpenMenu
  })), isCompact && React.createElement(Button, {
    type: "highlight",
    onClick: () => hadleSettings()
  }, "Settings"));
};

export default SelectChart;