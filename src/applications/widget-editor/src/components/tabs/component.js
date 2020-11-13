import React, { useState, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button } from "@widget-editor/shared";

// TODO: Move each component to its own file

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

export const Tabs = ({ visible, theme, children }) => {
  const visibleChildren = useMemo(
    () => children.filter(child => !!child && visible[child.props.id]),
    [children, visible]
  );
  const [activeId, setActiveId] = useState(visibleChildren[0].props.id);

  // When the user switched between map and chart, some tabs disappear
  // Here we make sure that we always have a tab active
  useEffect(() => {
    if (!visible[activeId]) {
      setActiveId(visibleChildren[0].props.id);
    }
  }, [visible, visibleChildren, activeId, setActiveId]);

  return (
    <StyledTabsContainer>
      <StyledList {...theme}>
        {visibleChildren.map(({ props: { id, label } }) => label
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
      <StyledTabsContentBox {...theme}>
        {visibleChildren.map(({ props: { id, children: content } }) => (
          <StyledTabsContent key={id} active={id === activeId}>
            {content}
          </StyledTabsContent>
        ))}
      </StyledTabsContentBox>
    </StyledTabsContainer>
  );
};

Tabs.propTypes = {
  visible: PropTypes.object,
  theme: PropTypes.object,
  children: PropTypes.any
}

/**
 *
 * @param {label} label require for displaying tab
 */
export const Tab = ({ children, label }) => {
  return label ? children : null;
};

Tab.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any
}
