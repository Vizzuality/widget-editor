import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import {
  setSelectedScheme,
  updateScheme,
  setSchemes,
} from "@widget-editor/shared/lib/modules/theme/actions";
import { selectSchemes, selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";
import { selectWidgetScheme } from "@widget-editor/shared/lib/modules/editor/selectors";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import Component from "./component";

export default connectState(
  (state) => ({
    schemes: selectSchemes(state),
    scheme: selectScheme(state),
    widgetScheme: selectWidgetScheme(state),
  }),
  {
    setSelectedScheme,
    updateScheme,
    setSchemes,
    patchConfiguration,
  }
)(Component);
