function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { Fragment } from 'react';
import { MENU_DATA, TYPE_COLUMN, TYPE_BAR } from "../../const";
import { StyledContainer, StyledMenu, StyledTitle, StyledIcons } from "./style";
import ChartIcon from "../ChartIcon";

const ChartList = ({
  list,
  setData,
  title
}) => {
  return /*#__PURE__*/React.createElement(Fragment, null, list.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StyledTitle, null, title), /*#__PURE__*/React.createElement(StyledIcons, null, list.map((el, key) => /*#__PURE__*/React.createElement(ChartIcon, _extends({
    key: key,
    setData: setData
  }, el))))));
};
/**
 * MENU_DATA - the array of charts for showing in menu
 * @param {options} - the array of available charts 
 */


const ChartMenu = ({
  options,
  getValue,
  setValue,
  innerRef,
  innerProps
}) => {
  const data = getValue()[0];
  const menu = MENU_DATA.map(m => {
    m.active = m.type === data.chartType && m.direction === data.direction ? true : false;
    m.disabled = options.find(o => o.chartType === m.type && o.direction === m.direction) ? false : true;
    return m;
  });
  const columns = menu.filter(m => m.type === TYPE_COLUMN);
  const bars = menu.filter(m => m.type === TYPE_BAR);
  const more = menu.filter(m => m.type !== TYPE_BAR && m.type !== TYPE_COLUMN);

  const setData = selected => {
    const dataSet = options.find(el => el.chartType === selected.type && el.direction === selected.direction);
    if (dataSet) setValue(dataSet);
  };

  return /*#__PURE__*/React.createElement(StyledContainer, _extends({
    ref: innerRef
  }, innerProps), /*#__PURE__*/React.createElement(StyledMenu, null, /*#__PURE__*/React.createElement(ChartList, {
    title: "Columns",
    setData: setData,
    list: columns
  }), /*#__PURE__*/React.createElement(ChartList, {
    title: "Bars",
    setData: setData,
    list: bars
  }), /*#__PURE__*/React.createElement(ChartList, {
    title: "More",
    setData: setData,
    list: more
  })));
};

export default ChartMenu;