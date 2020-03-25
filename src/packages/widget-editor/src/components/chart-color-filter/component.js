import React from "react";
import Slider from "react-slick";
import Select from "components/select";
import isObjectLike from "lodash/isObjectLike";

import {
  StyledContainer,
  StyledColorsBoxContainer,
  StyledColorsBox,
  StyledColorDot,
  StyledDropdownBox
} from "./style";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 2,
  adaptiveHeight: true,
  arrows: false
};

const SINGLE_COLOR_OPTION = {
  alias: "Single color",
  identifier: "___single_color"
};

const ChartColorFilter = ({
  color,
  configuration,
  schemeColor,
  activeScheme,
  columns,
  widgetData,
  setFilters,
  patchConfiguration
}) => {
  const defaultValue = isObjectLike(color) ? color : SINGLE_COLOR_OPTION;

  const handleChange = option => {
    const color = option.identifier === "___single_color" ? null : option;
    setFilters({
      color
    });
    patchConfiguration({ color });
  };

  return (
    <StyledContainer>
      {!isObjectLike(color) && (
        <StyledColorsBoxContainer alignCenter={!isObjectLike(color)}>
          <StyledColorsBox>
            <StyledColorDot color={schemeColor} />
            Single color
          </StyledColorsBox>
        </StyledColorsBoxContainer>
      )}
      {isObjectLike(color) && (
        <StyledColorsBoxContainer list={true}>
          {widgetData.map((node, index) => {
            return (
              <StyledColorsBox list={true} key={node.x}>
                <StyledColorDot color={activeScheme.category[index]} />
                {node.x}
              </StyledColorsBox>
            );
          })}
        </StyledColorsBoxContainer>
      )}
      <StyledDropdownBox>
        <Select
          align="horizontal"
          relative={true}
          menuPlacement="top"
          defaultValue={defaultValue}
          onChange={handleChange}
          getOptionLabel={option => option.alias || option.name}
          getOptionValue={option => option.identifier}
          options={[SINGLE_COLOR_OPTION, ...columns]}
          configuration={configuration}
          isCustom
          isPopup
        />
      </StyledDropdownBox>
    </StyledContainer>
  );
};

export default ChartColorFilter;
