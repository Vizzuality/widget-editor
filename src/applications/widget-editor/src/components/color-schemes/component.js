import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import { Button } from "@widget-editor/shared";

import ColorInput from "styles-common/color-input";
import {
  StyledSchemesContainer,
  StyledSchemesCardWrapper,
  StyledSchemesCard,
  StyledCardBox,
  StyledSchemeName,
  StyledSchemeInfo,
  StyledSchemeColors,
  StyledCustomSchemeButtonWrapper,
  StyledCustomSchemeWrapper,
} from "./style";

const ColorSchemes = ({
  schemes,
  scheme,
  setSelectedScheme,
  updateScheme,
  setSchemes,
  patchConfiguration
}) => {
  const schemesContainCustomScheme = useMemo(
    // If the user has manually created a custom scheme, it will be present in the schemes array
    () => !!schemes.find(s => s.name === "user-custom"),
    [schemes],
  );

  const isSchemeCustom = useMemo(
    // The current scheme is considered custom if it's named user-custom or if it's not supported by
    // the host app (i.e. not present in the schemes array)
    () => scheme.name === 'user-custom' || !schemes.find(s => s.name === scheme.name),
    [schemes, scheme],
  );

  const availableSchemes = useMemo(() => {
    const schemesWithIds = schemes.map(s => ({
      ...s,
      id: s.name,
      name: s.name === 'user-custom' ? 'Custom' : s.name
    }));

    // If the scheme is custom and wasn't defined by the user, then it's inherited through the
    // widget (i.e. it's been embedded in the widget)
    // An additional “Custom” option can be displayed using the custom scheme's configuration
    if (isSchemeCustom && !schemesContainCustomScheme) {
      return [...schemesWithIds, { ...scheme, id: scheme.name, name: "Custom" }];
    }

    // If the user defined a custom scheme or the widget (if any) doesn't have any embedded one,
    // then we just return the schemes
    return schemesWithIds;
  }, [schemes, scheme, schemesContainCustomScheme, isSchemeCustom]);

  const onChangeScheme = useCallback(s => {
    setSelectedScheme(s.name);
    patchConfiguration();
  }, [patchConfiguration, setSelectedScheme]);

  const onChangeColor = useCallback((index, value) => {
    const newColorRange = [...scheme.category];
    newColorRange.splice(index, 1, value);

    // We don't need to update the name of the scheme to `user-custom` or to set it as the
    // selected scheme as the updateScheme will do it for us
    const newScheme = {
      ...scheme,
      mainColor: newColorRange[0],
      category: newColorRange,
    };

    updateScheme(newScheme);
    patchConfiguration();
  }, [patchConfiguration, scheme, updateScheme]);

  const onCreateCustomScheme = useCallback(
    () => {
      // We duplicate the current scheme
      setSchemes([...schemes, { ...scheme, name: 'user-custom' }]);
      setSelectedScheme('user-custom');
      patchConfiguration();
    },
    [setSchemes, schemes, scheme, setSelectedScheme, patchConfiguration],
  );

  return (
    <StyledSchemesContainer>
      {!isSchemeCustom && !schemesContainCustomScheme && (
        <StyledCustomSchemeButtonWrapper>
          <Button size="small" onClick={onCreateCustomScheme}>
            Create custom scheme
          </Button>
        </StyledCustomSchemeButtonWrapper>
      )}

      <StyledSchemesCardWrapper>
        {availableSchemes.map((availableScheme) => (
          <StyledSchemesCard key={availableScheme.id}>
            <StyledCardBox
              active={scheme.name === availableScheme.id}
              onClick={() => onChangeScheme(availableScheme)}
            >
              <StyledSchemeInfo>
                <StyledSchemeName>{availableScheme.name}</StyledSchemeName>
                <StyledSchemeColors>
                  <div
                    style={{ flexBasis: "100%", background: availableScheme.mainColor }}
                  />
                  <div style={{ flexBasis: "100%", display: "flex" }}>
                    {(availableScheme.category || []).map((color) => (
                      <div
                        key={color}
                        style={{
                          flexBasis: `${100 / availableScheme.category.length}%`,
                          background: color,
                        }}
                      />
                    ))}
                  </div>
                </StyledSchemeColors>
              </StyledSchemeInfo>
            </StyledCardBox>
          </StyledSchemesCard>
        ))}
      </StyledSchemesCardWrapper>

      {isSchemeCustom && (
        <StyledCustomSchemeWrapper>
          <legend>Customize scheme</legend>
          <div className="container">
            {scheme.category.map((color, index) => (
              <ColorInput
                key={index}
                pickerLabel={`Color ${index + 1}`}
                inputLabel={`Hexadecimal color ${index + 1}`}
                value={color}
                onChange={value => onChangeColor(index, value)}
              />
            ))}
          </div>
        </StyledCustomSchemeWrapper>
      )}
    </StyledSchemesContainer>
  );
};

ColorSchemes.propTypes = {
  schemes: PropTypes.arrayOf(PropTypes.object).isRequired,
  scheme: PropTypes.object.isRequired,
  setSelectedScheme: PropTypes.func.isRequired,
  updateScheme: PropTypes.func.isRequired,
  setSchemes: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

export default ColorSchemes;
