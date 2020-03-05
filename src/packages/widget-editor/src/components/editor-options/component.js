import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from "components/tabs";

import QueryLimit from "components/query-limit";
import WidgetInfo from "components/widget-info";
import OrderValues from "components/order-values";
import TableView from "components/table-view";
import JsonEditor from "components/json-editor";
import Filter from "components/filter";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  flex: 1;
  background: #fff;
  height: calc(100% - ${FOOTER_HEIGHT} - 20px);
  padding: 0 30px;
  margin: 10px 0;
  overflow-y: scroll;
  ${DEFAULT_BORDER(1, 1, 1, 0)}
  ${props =>
    props.compact.isCompact &&
    css`
      visibility: hidden;
      /* z-index: -1; */
      max-height: 0;
      position: absolute;
      top: 65px;
      left: 0;
      margin: 0;
      width: 100%;
      transition: all 0.3s ease-in-out;
    `}
  ${props =>
    props.compact.isCompact &&
    props.compact.isOpen &&
    css`
      display: block;
      z-index: auto;
      visibility: visible;
      max-height: calc(100% - ${FOOTER_HEIGHT} - 65px);
    `}
`;

const EditorOptions = ({ orderBy, compact }) => {
  const [minValue, setMinValue] = useState(10);
  const [maxValue, setMaxValue] = useState(40);
  const onSetData = value => {
    if (Array.isArray(value)) {
      setMinValue(Number(value[0]));
      setMaxValue(Number(value[1]));
    } else {
      setMaxValue(Number(value));
    }
  };

  return (
    <StyledContainer compact={compact}>
      <Tabs>
        <Tab label="General">
          <Accordion>
            <AccordionSection title="Description and labels">
              <WidgetInfo />
            </AccordionSection>
            <AccordionSection title="Filters" openDefault>
              <Filter />

              <QueryLimit
                max={100}
                label="Limit"
                value={[minValue, maxValue]}
                onChange={value => onSetData(value)}
                handleOnChangeValue={(value, key = "maxValue") =>
                  key === "minValue"
                    ? setMinValue(Number(value))
                    : setMaxValue(Number(value))
                }
              />
            </AccordionSection>
            <AccordionSection title="Order">
              {orderBy && <OrderValues />}
            </AccordionSection>
          </Accordion>
        </Tab>
        <Tab label="Visual style">Visual style</Tab>
        <Tab label="Advanced">
          <JsonEditor />
        </Tab>
        <Tab label="Table view">
          <TableView />
        </Tab>
      </Tabs>
    </StyledContainer>
  );
};

export default EditorOptions;
