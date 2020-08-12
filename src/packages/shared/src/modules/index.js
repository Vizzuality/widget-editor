import { combineReducers } from "redux";
import { handleModule } from "vizzuality-redux-tools";

import { constants } from "@widget-editor/core";

import * as editor from "modules/editor";
import * as theme from "modules/theme";
import * as widgetConfig from "modules/widget-config";
import * as configuration from "modules/configuration";
import * as filters from "modules/filters";

const modules = {
  configuration: handleModule(configuration),
  editor: handleModule(editor),
  theme: handleModule(theme),
  filters: handleModule(filters),
  widgetConfig: handleModule(widgetConfig),
};

export default {
  [constants.APP_NAMESPACE]: combineReducers(modules),
};
