function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState, useEffect } from "react";
import { Button } from "@packages/shared";
import { StyledTabsContainer, StyledTabsContentBox, StyledTabsContent, StyledList, StyledListLabel } from "./style";

const TabButton = props => {
  return React.createElement(Button, _extends({
    style: {
      height: "100%"
    }
  }, props));
};

export const Tabs = ({
  children
}) => {
  const serializeChildren = children.filter(c => !!c);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const defaultNum = serializeChildren.findIndex(child => child.props.default);
    setActive(defaultNum === -1 ? 0 : defaultNum);
  }, []);
  return React.createElement(StyledTabsContainer, null, React.createElement(StyledList, null, serializeChildren.map((child, num) => {
    const {
      label
    } = child.props;
    return label ? React.createElement(StyledListLabel, {
      key: num
    }, React.createElement(TabButton, {
      onClick: () => setActive(num),
      active: num === active
    }, label)) : null;
  })), React.createElement(StyledTabsContentBox, null, serializeChildren.map((child, num) => {
    const {
      children: tabContent
    } = child.props;
    return React.createElement(StyledTabsContent, {
      key: num,
      active: num === active
    }, tabContent);
  })));
};
/**
 *
 * @param {label} label require for displaying tab
 */

export const Tab = ({
  children,
  label
}) => {
  return label ? children : null;
};