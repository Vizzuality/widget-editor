import React from 'react';
import {
  StyledShemesContainer,
  StyledShemesCard,
  StyledCardBox,
  StyledShemeName,
  StyledShemeInfo,
  StyledShemeColors,
} from './style';

const ColorShemes = ({ theme, setTheme }) => {

  const { schemes, selectedScheme } = theme;

  const onChangeTheme = (sheme) => {
    setTheme({ ...theme, selectedScheme: sheme.name });
  }

  return (
    <StyledShemesContainer>
      {schemes.map(sheme => {
        return (
          <StyledShemesCard key={sheme.name}>
            <StyledCardBox active={selectedScheme === sheme.name} onClick={() => onChangeTheme(sheme)}>
              <StyledShemeInfo>
                <StyledShemeName>{sheme.name}</StyledShemeName>
                <StyledShemeColors>
                  <div style={{ flexBasis: '100%', background: sheme.mainColor }} />
                  <div style={{ flexBasis: '100%', display: 'flex' }}>
                    {sheme.category.map(color => (
                      <div key={color} style={{ flexBasis: `${100 / sheme.category.length}%`, background: color }} />
                    ))}
                  </div>
                </StyledShemeColors>
              </StyledShemeInfo>
            </StyledCardBox>
            
          </StyledShemesCard>
        )
      })}
    </StyledShemesContainer>
  );
  
}

export default ColorShemes;