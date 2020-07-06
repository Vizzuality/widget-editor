import React, { Fragment } from "react";
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
  const data = getValue()[0];
  const menu = MENU_DATA.map(menu => ({
    ...menu,
    active: menu.type === data.chartType,
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

export default ChartMenu;
