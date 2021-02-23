import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from "styled-components";

import SvgClose from './legend-close';

const StyledLegend = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-30px, 20px);
  width: 200px;
  border-radius: 4px;
  padding: 0 15px;
  max-height: 200px;
  overflow: scroll;

  ${props => props.open && css`
    box-shadow: 0 20px 30px 0 rgba(0,0,0,.1);
    border: 1px solid rgba(26,28,34,.1);
    background: #FFF;
  `}

`;

const StyledLegendItem = styled.ul`
  list-style: none;
  padding: 15px 0;
`;

const StyledLegendValue = styled.li`
  padding: 2px 0;
  font-size: 14px;
  color: #393f44;
`;

const StyledValueColor = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  padding: 0;
  border: 1px solid rgba(26,28,34,.1);
  margin: 0 10px 0 0;
  ${props => props.color && css`
    background: ${props.color};
  `}
`;

const StyledClosedLegend = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 13px;
  color: #717171;
  cursor: pointer;
`;

const StyledClosedLegendInfo = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  justify-content: center;
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border: 1px solid hsla(0,0%,43.9%,.2);
  border-radius: 100%;
  font-family: Georgia,serif;
  font-style: italic;
  color: #393f44;
`

const StyledCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  svg {
    width: inherit;
    height: inherit;
  }
`;

const Legend = ({ widgetConfig }) => {
  const [open, setOpen] = useState(true);
  return (<StyledLegend open={open}>
    {open && <StyledCloseButton type="button" role="button" onClick={() => setOpen(!open)}>
      <SvgClose />
    </StyledCloseButton>}
    {!open && <StyledClosedLegend onClick={() => setOpen(true)}><StyledClosedLegendInfo>i</StyledClosedLegendInfo>Legend</StyledClosedLegend>}
    {open && widgetConfig.legend.map((leg, index) => (
      <StyledLegendItem key={`legend-item-${index}`}>
        {leg.values.map(legendValue => (
          <StyledLegendValue key={legendValue.label}>
            <StyledValueColor color={legendValue.value}/>
            {legendValue.label}
          </StyledLegendValue>
        ))}
      </StyledLegendItem>
    ))}
  </StyledLegend>);
}

Legend.propTypes = {
  widgetConfig: PropTypes.shape({
    legend: PropTypes.arrayOf(PropTypes.object)
  })
}

export default Legend;