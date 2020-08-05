import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import { setSelectedScheme } from "@widget-editor/shared/lib/modules/theme/actions";
import { selectSchemes, selectScheme } from "@widget-editor/shared/lib/modules/theme/selectors";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import Component from "./component";

export default connectState(
  (state) => ({
    schemes: selectSchemes(state),
    scheme: selectScheme(state),
  }),
  {
    setSelectedScheme,
    patchConfiguration,
  }
)(Component);
