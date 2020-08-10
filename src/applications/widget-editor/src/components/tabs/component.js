import React, { useState, useMemo } from "react";
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
  const validChildren = useMemo(() => children.filter(c => !!c), [children]);
  const [activeId, setActiveId] = useState(validChildren[0].props.id);

  return (
    <StyledTabsContainer>
      <StyledList>
        {validChildren.map(({ props: { id, label } }) => label
          ? (
            <StyledListLabel key={id}>
              <TabButton onClick={() => setActiveId(id)} active={id === activeId}>
                {label}
              </TabButton>
            </StyledListLabel>
          )
          : null
        )}
      </StyledList>
      <StyledTabsContentBox>
        {validChildren.map(({ props: { id, children: content } }) => (
          <StyledTabsContent key={id} active={id === activeId}>
            {content}
          </StyledTabsContent>
        ))}
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
