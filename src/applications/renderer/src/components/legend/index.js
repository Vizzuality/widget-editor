import { redux } from "@widget-editor/shared";

import { patchConfiguration,  } from "@widget-editor/shared/lib/modules/configuration/actions";
import {
  selectSelectedColorOption,
} from "@widget-editor/shared/lib/modules/configuration/selectors";
import { selectColumnOptions } from "@widget-editor/shared/lib/modules/editor/selectors";
import * as themeSelectors from "@widget-editor/shared/lib/modules/theme/selectors";

// Components
import ChartColorFilter from "./component";


export default redux.connectState(
  (state) => ({
    advanced: state.editor.advanced,
    widget: state.widgetConfig,
    configuration: state.configuration,
    selectedColumn: selectSelectedColorOption(state),
    columns: [
      {
        label: "Single color",
        value: "_single_color",
      },
      ...selectColumnOptions(state),
    ],
    scheme: themeSelectors.selectScheme(state),
  }),
  { patchConfiguration }
)(ChartColorFilter);
