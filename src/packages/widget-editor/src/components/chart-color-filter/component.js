import React from "react";
import Slider from "react-slick";
import Select from "components/select";
import isObjectLike from "lodash/isObjectLike";

import {
  StyledContainer,
  StyledColorsBoxContainer,
  StyledColorsBox,
  StyledColorDot,
  StyledDropdownBox,
} from "./style";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 2,
  adaptiveHeight: true,
  arrows: false,
};

let c = 0;
const resolveSchemeColor = (scheme, index) => {
  if (index % scheme.length === 0) {
    c = 0;
  }
  const color = scheme[c];
  c++;
  return color;
};

const ChartColorFilter = ({
  color,
  configuration,
  schemeColor,
  selectedColor,
  activeScheme,
  columns,
  widgetData,
  setFilters,
  patchConfiguration,
}) => {
  const isPie = configuration.chartType === "pie";
  const isSingleColorSelection = !isPie && !isObjectLike(color);

  const handleChange = (option) => {
    const color = option.identifier === "___single_color" ? null : option;

    if (isPie) {
      patchConfiguration({ category: color });
    } else {
      setFilters({
        color,
      });
      patchConfiguration({ color });
    }
  };

  return (
    <StyledContainer>
      {isSingleColorSelection && (
        <StyledColorsBoxContainer
          overflowIsHidden={false}
          alignCenter={!isObjectLike(color)}
        >
          <StyledColorsBox alignCenter={false}>
            <StyledColorDot color={schemeColor} />
            Single color
          </StyledColorsBox>
        </StyledColorsBoxContainer>
      )}
      {!isSingleColorSelection && (
        <StyledColorsBoxContainer overflowIsHidden={true}>
          {widgetData &&
            widgetData.map((node, index) => {
              return (
                <StyledColorsBox alignCenter={true} key={`${node.x}-${index}`}>
                  <StyledColorDot
                    color={resolveSchemeColor(activeScheme.category, index)}
                  />
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
          value={selectedColor}
          onChange={handleChange}
          getOptionLabel={(option) =>
            option.name || option.alias || option.identifier
          }
          getOptionValue={(option) => option.identifier}
          options={columns}
          configuration={configuration}
          isCustom
          isPopup
        />
      </StyledDropdownBox>
    </StyledContainer>
  );
};

export default ChartColorFilter;
