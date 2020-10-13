import React from 'react';
import FlexContainer from 'styles-common/flex';
import FormLabel from 'styles-common/form-label';
import InputGroup from 'styles-common/input-group';
import Input from 'styles-common/input';
import { Select } from '@widget-editor/shared';
import { FONTS } from './const';

const Typography = ({ theme, setTheme }) => {

  const {
    font,
    titleSize,
    captionSize,
    axisTitleSize,
  } = theme;

  const selectedFont = FONTS.find(f => f.value === font) || FONTS[0];

  const handleChangeFont = option => {
    setTheme({ ...theme, font: option.value });
  };

  const handleChangeSize = (key, value) => {
    const reg = new RegExp('^[0-9]*$');
    const setValue = value !== '' && reg.test(Number(value)) ? value : 'auto';
    setTheme({ ...theme, [key]: setValue });
  }

  return (
    <div>
        <FormLabel htmlFor="typography-font">Font</FormLabel>
        <Select
          id="typography-font"
          value={selectedFont}
          onChange={handleChangeFont}
          options={FONTS}
        />
        <br />
        <FlexContainer row={true}>
          <InputGroup>
            <FormLabel htmlFor="typography-title-size">Title size</FormLabel>
            <Input 
              name="typography-title-size" 
              value={titleSize === "auto" ? '' : titleSize}
              type="text"
              onChange={e => handleChangeSize('titleSize', e.target.value)}
              placeholder="Auto"
            />
          </InputGroup>
          <InputGroup>
            <FormLabel htmlFor="typography-caption-size">Caption size</FormLabel>
            <Input 
              name="typography-caption-size" 
              value={captionSize === "auto" ? '' : captionSize}
              type="text"
              onChange={e => handleChangeSize('captionSize', e.target.value)}
              placeholder="Auto"
            />
          </InputGroup>
          <InputGroup>
            <FormLabel htmlFor="typography-axis-title-size">Axis title size</FormLabel>
            <Input 
              name="typography-axis-title-size" 
              value={axisTitleSize === "auto" ? '' : axisTitleSize}
              type="text"
              onChange={e => handleChangeSize('axisTitleSize', e.target.value)}
              placeholder="Auto"
            />
          </InputGroup>
        </FlexContainer>      
    </div>
  );
}



export default Typography;