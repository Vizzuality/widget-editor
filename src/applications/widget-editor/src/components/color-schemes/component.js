import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import { Button } from "@widget-editor/shared";

import ColorInput from "styles-common/color-input";
import { isSchemeCustom, containsCustomScheme } from './helpers';
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
  widgetScheme,
  setSelectedScheme,
  updateScheme,
  setSchemes,
  patchConfiguration
}) => {
  const schemesContainCustomScheme = useMemo(() => containsCustomScheme(schemes), [schemes]);
  const isCustomScheme = useMemo(() => isSchemeCustom(scheme, schemes), [schemes, scheme]);
  const isWidgetSchemeCustom = useMemo(
    () => isSchemeCustom(widgetScheme, schemes),
    [schemes, widgetScheme],
  );

  const availableSchemes = useMemo(() => {
    const schemesWithIds = schemes.map(s => ({
      ...s,
      id: s.name,
      name: s.name === 'user-custom' ? 'Custom' : s.name
    }));

    if (isCustomScheme && !schemesContainCustomScheme) {
      // If the scheme is custom and wasn't defined by the user, then it's inherited through the
      // widget (i.e. it's been embedded in the widget)
      // An additional “Custom” option can be displayed using the custom scheme's configuration
      return [...schemesWithIds, { ...scheme, id: scheme.name, name: "Custom" }];
    } else if (isWidgetSchemeCustom && !schemesContainCustomScheme) {
      // If the widget has an embedded scheme, it is custom and the user hasn't created a custom
      // scheme yet, then we can add a “Custom” option representing the widget's embedded scheme
      return [...schemesWithIds, { ...widgetScheme, id: widgetScheme.name, name: "Custom" }];
    }

    // If the user defined a custom scheme or the widget (if any) doesn't have any embedded one,
    // then we just return the schemes
    return schemesWithIds;
  }, [
    schemes,
    scheme,
    widgetScheme,
    schemesContainCustomScheme,
    isCustomScheme,
    isWidgetSchemeCustom
  ]);

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

  const onSelectScheme = useCallback((selectedScheme) => {
    // If the user clicks on a custom scheme that wasn't created by them (i.e. the scheme is not
    // part of the `schemes` array), then it means that the schemes was embedded with the widget
    // (if there's any)
    // Then by setting the store's selectedScheme to `null`, we will tell the application to use the
    // widget's embedded scheme
    const isCustom = isSchemeCustom(selectedScheme, schemes);
    setSelectedScheme(isCustom && !schemesContainCustomScheme ? null : selectedScheme.id);
    patchConfiguration();
  }, [schemes, schemesContainCustomScheme, setSelectedScheme, patchConfiguration]);

  return (
    <StyledSchemesContainer>
      {!isCustomScheme && !schemesContainCustomScheme && !isWidgetSchemeCustom && (
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
              onClick={() => onSelectScheme(availableScheme)}
            >
              <StyledSchemeInfo>
                <StyledSchemeName>{availableScheme.name}</StyledSchemeName>
                <StyledSchemeColors>
                  <div
                    style={{ flexBasis: "100%", background: availableScheme.mainColor }}
                  />
                  <div style={{ flexBasis: "100%", display: "flex" }}>
                    {(availableScheme.category || []).map((color, index) => (
                      <div
                        key={index}
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

      {isCustomScheme && (
        <StyledCustomSchemeWrapper>
          <legend>Customize scheme</legend>
          <div className="container">
            {scheme.category.map((color, index) => (
              <ColorInput
                key={index}
                id={index + 1}
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
  widgetScheme: PropTypes.object,
  setSelectedScheme: PropTypes.func.isRequired,
  updateScheme: PropTypes.func.isRequired,
  setSchemes: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

ColorSchemes.defaultProps = {
  widgetScheme: null,
};

export default ColorSchemes;
