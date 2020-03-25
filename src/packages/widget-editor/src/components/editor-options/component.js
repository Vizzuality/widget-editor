import React from "react";
import styled, { css } from "styled-components";

import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from "components/tabs";
import WidgetInfo from "components/widget-info";
import OrderValues from "components/order-values";
import QueryLimit from "components/query-limit";
import TableView from "components/table-view";
import JsonEditor from "components/json-editor";
import Filter from "components/filter";
import Typography from "components/typography";
import ColorShemes from "components/color-shemes";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyleEditorOptionsErrors = styled.div`
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
  h3 {
    color: #ff6464;
    text-align: center;
  }
  p {
    color: #bfbfbf;
    font-size: 12px;
  }
`;

const StyledContainer = styled.div`
  position: relative;
  flex: 1;
  background: #fff;
  height: calc(100% - ${FOOTER_HEIGHT} - 20px);
  padding: 0 0 0 30px;
  margin: 10px 0;
  overflow-y: hidden;
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
      box-sizing: border-box;
      display: block;
      z-index: auto;
      visibility: visible;
      max-height: calc(100% - ${FOOTER_HEIGHT} - 65px);
    `}
`;

const EditorOptions = ({
  datasetId,
  limit,
  orderBy,
  patchConfiguration,
  compact,
  dataService
}) => {
  const handleChange = (value, type) => {
    if (type === "limit") {
      patchConfiguration({ limit: value });
    }
    if (type === "orderBy") {
      patchConfiguration({ orderBy: value });
    }
  };

  if (!datasetId) {
    return (
      <StyledContainer compact={compact}>
        <StyleEditorOptionsErrors>
          <h3>Error loading dataset</h3>
          <p>Dataset not accessible at this moment.</p>
        </StyleEditorOptionsErrors>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer compact={compact}>
      <Tabs>
        <Tab label="General">
          <Accordion>
            <AccordionSection title="Description and labels">
              <WidgetInfo />
            </AccordionSection>
            <AccordionSection title="Filters">
              <Filter dataService={dataService} />
            </AccordionSection>
            <AccordionSection title="Order">
              {orderBy && (
                <OrderValues
                  onChange={value => handleChange(value, "orderBy")}
                />
              )}
              {limit && (
                <QueryLimit
                  min={0}
                  max={500}
                  onChange={value => handleChange(value, "limit")}
                  handleOnChangeValue={value => handleChange(value, "limit")}
                  label="Limit"
                  value={limit}
                />
              )}
            </AccordionSection>
          </Accordion>
        </Tab>
        <Tab label="Visual style" default>
          <Accordion>
            <AccordionSection title="Typography">
              <Typography />
            </AccordionSection>
            <AccordionSection title="Color" openDefault>
              <ColorShemes />
            </AccordionSection>
          </Accordion>
        </Tab>
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
