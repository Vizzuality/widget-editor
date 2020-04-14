import React from "react";
import { StyledShemesContainer, StyledShemesCard, StyledCardBox, StyledShemeName, StyledShemeInfo, StyledShemeColors } from "./style";

const ColorShemes = ({
  theme,
  setTheme
}) => {
  const {
    schemes,
    selectedScheme
  } = theme;

  const onChangeTheme = sheme => {
    setTheme({ ...theme,
      selectedScheme: sheme.name
    });
  };

  return React.createElement(StyledShemesContainer, null, schemes.map((sheme, index) => {
    return React.createElement(StyledShemesCard, {
      key: `${sheme.name}-${index}`
    }, React.createElement(StyledCardBox, {
      active: selectedScheme === sheme.name,
      onClick: () => onChangeTheme(sheme)
    }, React.createElement(StyledShemeInfo, null, React.createElement(StyledShemeName, null, sheme.name), React.createElement(StyledShemeColors, null, React.createElement("div", {
      style: {
        flexBasis: "100%",
        background: sheme.mainColor
      }
    }), React.createElement("div", {
      style: {
        flexBasis: "100%",
        display: "flex"
      }
    }, sheme.category.map(color => React.createElement("div", {
      key: color,
      style: {
        flexBasis: `${100 / sheme.category.length}%`,
        background: color
      }
    })))))));
  }));
};

export default ColorShemes;