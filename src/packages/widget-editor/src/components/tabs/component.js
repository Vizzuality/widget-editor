import React, { useState, useEffect } from 'react';
import Button from 'components/button';
import { 
  StyledTabsContainer,
  StyledTabsContentBox,
  StyledTabsContent,
  StyledList,
  StyledListLabel
} from './style';

const TabButton = (props) => {
  return <Button style={{ height: "100%" }} {...props} />
}

export const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);
  useEffect(()=>{
    const defaultNum = children.findIndex(child => child.props.default);
    setActive(defaultNum === -1 ? 0 : defaultNum);
  },[]);
  return (
    <StyledTabsContainer>
      <StyledList>
        {children.map((child, num) => {
          const { label } = child.props;
          return label ? (
            <StyledListLabel key={num}>
              <TabButton
                onClick={() => setActive(num)} 
                active={num === active}
              >
              {label}
              </TabButton>
            </StyledListLabel>
          ) : null
        })}
      </StyledList>
      <StyledTabsContentBox>
        {children.map((child, num) => {
          const { children: tabContent } = child.props;
          return (
            <StyledTabsContent 
              key={num} 
              active={num === active}
            >
              {tabContent}
            </StyledTabsContent>
          )
        })}      
      </StyledTabsContentBox>
    </StyledTabsContainer>
  );
}

/**
 * 
 * @param {label} label require for displaying tab
 */
export const Tab = ({ children, label }) => {
  return label ? children : null;
}