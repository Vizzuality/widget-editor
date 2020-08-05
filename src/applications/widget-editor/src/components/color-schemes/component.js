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

const ColorSchemes = ({ schemes, scheme, setSelectedScheme, patchConfiguration }) => {
  const onChangeScheme = useCallback(s => {
    setSelectedScheme(s.name);
    patchConfiguration();
  }, [patchConfiguration, setSelectedScheme]);

  return (
    <StyledSchemesContainer>
      {schemes.map((s, index) => {
        return (
          <StyledSchemesCard key={`${s.name}-${index}`}>
            <StyledCardBox
              active={s.name === scheme.name}
              onClick={() => onChangeScheme(s)}
            >
              <StyledSchemeInfo>
                <StyledSchemeName>{s.name}</StyledSchemeName>
                <StyledSchemeColors>
                  <div
                    style={{ flexBasis: "100%", background: s.mainColor }}
                  />
                  <div style={{ flexBasis: "100%", display: "flex" }}>
                    {s.category.map((color) => (
                      <div
                        key={color}
                        style={{
                          flexBasis: `${100 / s.category.length}%`,
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
  scheme: PropTypes.object.isRequired,
  setSelectedScheme: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

export default ColorSchemes;
