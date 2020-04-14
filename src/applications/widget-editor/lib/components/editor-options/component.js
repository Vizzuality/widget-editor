import React, { Suspense } from "react";
import styled, { css } from "styled-components";
import { Accordion, AccordionSection } from "../accordion";
import { Tabs, Tab } from "../tabs";
import WidgetInfo from "../widget-info";
import OrderValues from "../order-values";
import GroupValues from "../group-values";
import QueryLimit from "../query-limit";
import Filter from "../filter";
import { FOOTER_HEIGHT, DEFAULT_BORDER } from "@packages/shared/lib/styles/style-constants";
const JsonEditor = React.lazy(() => import("../json-editor"));
const TableView = React.lazy(() => import("../table-view"));
const Typography = React.lazy(() => import("../typography"));
const ColorShemes = React.lazy(() => import("../color-shemes"));
const StyleEditorOptionsErrors = styled.div.withConfig({
  displayName: "component__StyleEditorOptionsErrors",
  componentId: "sc-1g7cyt6-0"
})(["position:absolute;left:50%;bottom:50%;transform:translate(-50%,-50%);h3{color:#ff6464;text-align:center;}p{color:#bfbfbf;font-size:12px;}"]);
const StyledContainer = styled.div.withConfig({
  displayName: "component__StyledContainer",
  componentId: "sc-1g7cyt6-1"
})(["position:relative;flex:1;background:#fff;height:calc(100% - ", " - 20px);padding:0 0 0 30px;margin:10px 0;overflow-y:hidden;", " ", " ", ""], FOOTER_HEIGHT, DEFAULT_BORDER(1, 1, 1, 0), props => props.compact.isCompact && css(["visibility:hidden;max-height:0;position:absolute;top:65px;left:0;margin:0;width:100%;transition:all 0.3s ease-in-out;"]), props => props.compact.isCompact && props.compact.isOpen && css(["box-sizing:border-box;display:block;z-index:auto;visibility:visible;max-height:calc(100% - ", " - 65px);"], FOOTER_HEIGHT));

const EditorOptions = ({
  disabledFeatures,
  datasetId,
  limit,
  orderBy,
  groupBy,
  patchConfiguration,
  compact,
  dataService
}) => {
  console.log(disabledFeatures);

  const handleChange = (value, type) => {
    if (type === "limit") {
      patchConfiguration({
        limit: value
      });
    }

    if (type === "orderBy") {
      patchConfiguration({
        orderBy: value
      });
    }

    if (type === "groupBy") {
      patchConfiguration({
        groupBy: value
      });
    }
  };

  if (!datasetId) {
    return React.createElement(StyledContainer, {
      compact: compact
    }, React.createElement(StyleEditorOptionsErrors, null, React.createElement("h3", null, "Error loading dataset"), React.createElement("p", null, "Dataset not accessible at this moment.")));
  }

  return React.createElement(StyledContainer, {
    compact: compact
  }, React.createElement(Tabs, null, React.createElement(Tab, {
    label: "General"
  }, React.createElement(Accordion, null, React.createElement(AccordionSection, {
    title: "Description and labels",
    default: true
  }, React.createElement(WidgetInfo, null)), React.createElement(AccordionSection, {
    title: "Filters"
  }, React.createElement(Filter, {
    dataService: dataService
  })), React.createElement(AccordionSection, {
    title: "Order"
  }, React.createElement(OrderValues, {
    onChange: value => handleChange(value, "orderBy")
  }), React.createElement(GroupValues, {
    onChange: value => handleChange(value, "groupBy")
  }), limit && React.createElement(QueryLimit, {
    min: 0,
    max: 500,
    onChange: value => handleChange(value, "limit"),
    handleOnChangeValue: value => handleChange(value, "limit"),
    label: "Limit",
    value: limit
  })))), React.createElement(Tab, {
    label: "Visual style"
  }, React.createElement(Accordion, null, disabledFeatures.indexOf("typogrophy") === -1 && React.createElement(AccordionSection, {
    title: "Typography"
  }, React.createElement(Suspense, {
    fallback: React.createElement("div", null, "Loading...")
  }, React.createElement(Typography, null))), disabledFeatures.indexOf("theme-selection") === -1 && React.createElement(AccordionSection, {
    title: "Color",
    openDefault: true
  }, React.createElement(Suspense, {
    fallback: React.createElement("div", null, "Loading...")
  }, React.createElement(ColorShemes, null))))), disabledFeatures.indexOf("advanced-editor") === -1 && React.createElement(Tab, {
    label: "Advanced"
  }, React.createElement(Suspense, {
    fallback: React.createElement("div", null, "Loading...")
  }, React.createElement(JsonEditor, null))), disabledFeatures.indexOf("table-view") === -1 && React.createElement(Tab, {
    label: "Table view"
  }, React.createElement(Suspense, {
    fallback: React.createElement("div", null, "Loading...")
  }, React.createElement(TableView, null)))));
};

export default EditorOptions;