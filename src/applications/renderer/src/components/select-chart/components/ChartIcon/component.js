import React from 'react';
import {
  TYPE_COLUMN,
  TYPE_LINE,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  TYPE_SCATTERPLOT,
  TYPE_RING,
  TYPE_BAR,
  TYPE_PIE,
} from '../../const';
import { StyledBox, StyledIcon } from './style';
import { 
  Line, 
  Scatterplot, 
  Ring, 
  Pie, 
  ColumnVertical, 
  ColumnHorizontal, 
  BarVertical, 
  BarHorizontal 
} from './svg';

const ChartIcon = ({
  type = TYPE_COLUMN,
  direction = DIRECTION_HORIZONTAL,
  active = false,
  disabled = false,
  setData = (data) => {console.log(data)}}) => {
  return (
    <StyledBox>
      <StyledIcon active={active} disabled={disabled} onClick={()=> setData({ type, direction })}>
        {type === TYPE_LINE && <Line />}
        {type === TYPE_SCATTERPLOT && <Scatterplot />}        
        {type === TYPE_RING && <Ring />}
        {type === TYPE_PIE && <Pie />}
        {type === TYPE_BAR && direction === DIRECTION_HORIZONTAL && <BarHorizontal />}
        {type === TYPE_BAR && direction === DIRECTION_VERTICAL && <BarVertical />}

        {type === TYPE_COLUMN && direction === DIRECTION_HORIZONTAL && <ColumnHorizontal />}
        {type === TYPE_COLUMN && direction === DIRECTION_VERTICAL && <ColumnVertical />}
      </StyledIcon>
    </StyledBox>
  );
}


export default ChartIcon;