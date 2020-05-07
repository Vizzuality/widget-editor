import React, { Fragment } from "react";
import {
  MENU_DATA,
  TYPE_COLUMN,
  TYPE_STACKED_BAR,
  TYPE_BAR,
  TYPE_BAR_HORIZONTAL,
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
  const menu = MENU_DATA.map((m) => {
    m.active = m.type === data.chartType ? true : false;
    m.disabled = options.find((o) => o.chartType === m.type) ? false : true;
    return m;
  });

  const columns = menu.filter(
    (m) => m.type === TYPE_COLUMN || m.type === TYPE_STACKED_BAR
  );
  const bars = menu.filter(
    (m) => m.type === TYPE_BAR || m.type === TYPE_BAR_HORIZONTAL
  );
  const more = menu.filter(
    (m) =>
      m.type !== TYPE_BAR &&
      m.type !== TYPE_BAR_HORIZONTAL &&
      m.type !== TYPE_COLUMN &&
      m.type !== TYPE_STACKED_BAR
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
