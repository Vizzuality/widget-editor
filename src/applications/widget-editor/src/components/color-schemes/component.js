import React, { useCallback } from "react";
import PropTypes from "prop-types";

import {
  StyledSchemesContainer,
  StyledSchemesCard,
  StyledCardBox,
  StyledSchemeName,
  StyledSchemeInfo,
  StyledSchemeColors,
} from "./style";

const ColorSchemes = ({ schemes, selectedScheme, setSelectedScheme, patchConfiguration }) => {
  const onChangeScheme = useCallback(scheme => {
    setSelectedScheme(scheme.name);
    patchConfiguration();
  }, [patchConfiguration, setSelectedScheme]);

  return (
    <StyledSchemesContainer>
      {schemes.map((scheme, index) => {
        return (
          <StyledSchemesCard key={`${scheme.name}-${index}`}>
            <StyledCardBox
              active={selectedScheme.name === scheme.name}
              onClick={() => onChangeScheme(scheme)}
            >
              <StyledSchemeInfo>
                <StyledSchemeName>{scheme.name}</StyledSchemeName>
                <StyledSchemeColors>
                  <div
                    style={{ flexBasis: "100%", background: scheme.mainColor }}
                  />
                  <div style={{ flexBasis: "100%", display: "flex" }}>
                    {scheme.category.map((color) => (
                      <div
                        key={color}
                        style={{
                          flexBasis: `${100 / scheme.category.length}%`,
                          background: color,
                        }}
                      />
                    ))}
                  </div>
                </StyledSchemeColors>
              </StyledSchemeInfo>
            </StyledCardBox>
          </StyledSchemesCard>
        );
      })}
    </StyledSchemesContainer>
  );
};

ColorSchemes.propTypes = {
  schemes: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedScheme: PropTypes.object.isRequired,
  setSelectedScheme: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

export default ColorSchemes;
