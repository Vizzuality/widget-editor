import React, { useState, useEffect } from "react";
import { Button } from "@widget-editor/shared";
import {
  StyledTabsContainer,
  StyledTabsContentBox,
  StyledTabsContent,
  StyledList,
  StyledListLabel,
} from "./style";

const TabButton = (props) => {
  return <Button style={{ height: "100%" }} {...props} />;
};

export const Tabs = ({ children }) => {
  const serializeChildren = children.filter((c) => !!c);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const defaultNum = serializeChildren.findIndex(
      (child) => child.props.default
    );
    setActive(defaultNum === -1 ? 0 : defaultNum);
  }, []);

  return (
    <StyledTabsContainer>
      <StyledList>
        {serializeChildren.map((child, num) => {
          const { label } = child.props;
          return label ? (
            <StyledListLabel key={num}>
              <TabButton onClick={() => setActive(num)} active={num === active}>
                {label}
              </TabButton>
            </StyledListLabel>
          ) : null;
        })}
      </StyledList>
      <StyledTabsContentBox>
        {serializeChildren.map((child, num) => {
          const { children: tabContent } = child.props;
          return (
            <StyledTabsContent key={num} active={num === active}>
              {tabContent}
            </StyledTabsContent>
          );
        })}
      </StyledTabsContentBox>
    </StyledTabsContainer>
  );
};

/**
 *
 * @param {label} label require for displaying tab
 */
export const Tab = ({ children, label }) => {
  return label ? children : null;
};
