import React from 'react';
import Slider from 'react-slick';
import Select from 'react-select';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

import {
  StyledContainer,
  StyledDataBox,
  StyledData,
  StyledColor,
  StyledTitle,
  StyledSliderBox,
  StyledDropdownBox,
  InputStyles,
} from './style';

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

const ChartColorFilter = ({ editor }) => {

  const { widgetData } = editor;
  const sliderData = [];
  const perPage = 6;
  widgetData && widgetData.forEach((data, key) => {
    const itemNumber = Math.floor(key/(perPage+1));
    sliderData[itemNumber] ? sliderData[itemNumber].push(data) : sliderData[itemNumber] = [];
  });

  const columns = [
    { value: 1, label: 'start' },
    { value: 1, label: 'end' },
  ];

  const horizontalValue = columns[0];

  const handleChangeHorizontal = () => {

  }

  return (
    <StyledContainer>
      <StyledSliderBox>
        <div>
          <Slider {...settings}>
            {sliderData && sliderData.map((slider, key) => (
              <div key={key}>
                <StyledDataBox>
                  {slider.map(s => (
                    <StyledData>
                      <StyledColor />
                      <StyledTitle>{s.x}</StyledTitle>
                    </StyledData>
                  ))}
                </StyledDataBox>
              </div>
            ))}
          </Slider>
        </div>
      </StyledSliderBox>
      <StyledDropdownBox>
        <Select
          menuPlacement="top"
          defaultValue={horizontalValue}
          onChange={handleChangeHorizontal}
          options={columns}
          styles={InputStyles}
        />
      </StyledDropdownBox>
    </StyledContainer>
  );
}

export default ChartColorFilter;