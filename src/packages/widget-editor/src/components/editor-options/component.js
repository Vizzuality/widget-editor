import React, { useState } from "react";
import styled from "styled-components";
import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from "components/tabs";

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

const EditorOptions = ({ orderBy }) => {

  const [minValue, setMinValue] = useState(10);
  const [maxValue, setMaxValue] = useState(40);
  const onSetData = (value) => {
    if (Array.isArray(value)) {
      setMinValue(Number(value[0])); 
      setMaxValue(Number(value[1]));
    } else {
      setMaxValue(Number(value));
    }
  }

  return (
    <StyledContainer>
      <Tabs>
        <Tab label="General">
          <Accordion>
            <AccordionSection title="Description and labels">
              <WidgetInfo />
            </AccordionSection>
            <AccordionSection title="Filters" openDefault>
              <QueryLimit 
                max={100}
                label="Limit"
                value={[minValue, maxValue]}
                onChange={(value) => onSetData(value)}
                handleOnChangeValue={(value, key) => key === 'minValue' ? setMinValue(Number(value)) : setMaxValue(Number(value))}
              />
            </AccordionSection>
            <AccordionSection title="Order">
              {orderBy && <OrderValues />}
            </AccordionSection>
          </Accordion>
        </Tab>
        <Tab label="Visual style">Visual style</Tab>
        <Tab label="Advanced">Advanced</Tab>
        <Tab label="Table view">
          <TableView />
        </Tab>
      </Tabs>
    </StyledContainer>
  );
};

export default EditorOptions;
