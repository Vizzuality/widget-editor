import React, { Fragment } from "react";
import PropTypes from 'prop-types';

import {
  MENU_DATA,
  TYPE_BAR,
  TYPE_STACKED_BAR,
  TYPE_BAR_HORIZONTAL,
  TYPE_STACKED_BAR_HORIZONTAL,
} from "../../const";
import { StyledContainer, StyledMenu, StyledTitle, StyledIcons } from "./style";
import ChartIcon from "../ChartIcon";

const ChartList = ({ list, setData, title }) => {
  return (
    <Fragment>
      {list.length > 0 && (
        <div>
          <StyledTitle>{title}</StyledTitle>
          <StyledIcons>
            {list.map((el, key) => (
              <ChartIcon key={key} setData={setData} {...el} />
            ))}
          </StyledIcons>
        </div>
      )}
    </Fragment>
  );
};
/**
 * MENU_DATA - the array of charts for showing in menu
 * @param {options} - the array of available charts
 */
const ChartMenu = ({ options, getValue, setValue, innerRef, innerProps }) => {
  const data = getValue()[0]; // Data may be null if all the visualization types are disabled
  const menu = MENU_DATA.map(menu => ({
    ...menu,
    active: data ? menu.type === data.chartType : null,
    disabled: !options.find(o => o.chartType === menu.type),
  }));

  const columns = menu.filter(m => m.type === TYPE_BAR || m.type === TYPE_STACKED_BAR);
  const bars = menu.filter(m => m.type === TYPE_BAR_HORIZONTAL || m.type === TYPE_STACKED_BAR_HORIZONTAL);
  const more = menu.filter(
    (m) =>
      m.type !== TYPE_BAR &&
      m.type !== TYPE_STACKED_BAR &&
      m.type !== TYPE_BAR_HORIZONTAL &&
      m.type !== TYPE_STACKED_BAR_HORIZONTAL
  );

  const setData = (selected) => {
    const dataSet = options.find((el) => el.chartType === selected.type);
    if (dataSet) setValue(dataSet);
  };

  return (
    <StyledContainer ref={innerRef} {...innerProps}>
      <StyledMenu>
        <ChartList title="Columns" setData={setData} list={columns} />
        <ChartList title="Bars" setData={setData} list={bars} />
        <ChartList title="More" setData={setData} list={more} />
      </StyledMenu>
    </StyledContainer>
  );
};

ChartList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  setData: PropTypes.func,
  title: PropTypes.string
}

ChartMenu.propTypes = {
  getValue: PropTypes.func,
  setValue: PropTypes.func,
  innerRef: PropTypes.object,
  innerProps: PropTypes.object,
  options: PropTypes.arrayOf(PropTypes.shape({
    chartType: PropTypes.string
  }))
}

export default ChartMenu;
