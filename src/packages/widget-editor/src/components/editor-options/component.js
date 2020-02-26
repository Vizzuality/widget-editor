import React from "react";
import styled from "styled-components";
import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from 'components/tabs';

import QueryLimit from "components/query-limit";
import WidgetInfo from "components/widget-info";
import OrderValues from "components/order-values";
import TableView from "components/table-view";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  flex: 1;
  background: #fff;
  height: calc(100% - ${FOOTER_HEIGHT} - 20px);
  padding: 0 30px;
  margin: 10px 0;
  overflow-y: scroll;
  ${DEFAULT_BORDER(1, 1, 1, 0)}
`;

const EditorOptions = () => {
  return (
    <StyledContainer>
      <Tabs>
        <Tab label="General">
          <Accordion>
            <AccordionSection title="Description and labels" openDefault>
              <WidgetInfo />
            </AccordionSection>
            <AccordionSection title="Filters">
              <QueryLimit />
            </AccordionSection>
            <AccordionSection title="Order">
              <OrderValues />
            </AccordionSection>
          </Accordion>
        </Tab>
        <Tab label="Visual style">
          Visual style
        </Tab>
        <Tab label="Advanced">
          Advanced
        </Tab>
        <Tab label="Table view">
          <TableView />
        </Tab>
      </Tabs>
    </StyledContainer>
  );
};

export default EditorOptions;
