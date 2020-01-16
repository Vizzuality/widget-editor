import { combineReducers } from "redux";
import { handleModule } from "vizzuality-redux-tools";

import { APP_NAMESPACE } from "helpers/redux";

import * as editor from "modules/editor";
import * as theme from "modules/theme";
import * as widget from "modules/widget";
import * as configuration from "modules/configuration";

const modules = {
  configuration: handleModule(configuration),
  editor: handleModule(editor),
  theme: handleModule(theme),
  widget: handleModule(widget)
};

export default {
  [APP_NAMESPACE]: combineReducers(modules)
};
