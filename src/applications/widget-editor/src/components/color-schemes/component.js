import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import { Button } from "@widget-editor/shared";

import {
  StyledSchemesContainer,
  StyledSchemesCard,
  StyledCardBox,
  StyledSchemeName,
  StyledSchemeInfo,
  StyledSchemeColors,
  StyledCustomSchemeButtonWrapper,
} from "./style";

const ColorSchemes = ({ schemes, scheme, setSelectedScheme, patchConfiguration }) => {
  const schemesContainCustomScheme = useMemo(
    // If the user has manually created a custom scheme, it will be present in the schemes array
    () => !!schemes.find(s => s.name === "user-custom"),
    [schemes],
  );

  const isSchemeCustom = useMemo(
    // The current scheme is considered custom if it's named user-custom or if it's not supported by
    // the host app (i.e. not present in the schemes array)
    // Either way, the scheme won't be present in schemes
    () => !schemes.find(s => s.name === scheme.name),
    [schemes, scheme],
  );

  const availableSchemes = useMemo(() => {
    const schemesWithIds = schemes.map(s => ({ ...s, id: s.name }));

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

  return (
    <StyledSchemesContainer>
      {!isSchemeCustom && !schemesContainCustomScheme && (
        <StyledCustomSchemeButtonWrapper>
          <Button size="small" disabled>
            Create custom scheme
          </Button>
        </StyledCustomSchemeButtonWrapper>
      )}

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
