import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import { selectChartType, isMap } from "@widget-editor/shared/lib/modules/configuration/selectors";
import {
  selectDisabledFeatures,
  selectAdvanced,
} from "@widget-editor/shared/lib/modules/editor/selectors";

import EditorOptionsComponent from "./component";

export default connectState(
  (state) => ({
    disabledFeatures: selectDisabledFeatures(state),
    advanced: selectAdvanced(state),
    initialized: state.editor.initialized,
    restoring: state.editor.restoring,
    rasterOnly: state.configuration.rasterOnly,
    datasetId:
      state.editor.dataset && state.editor.dataset.id
        ? state.editor.dataset.id
        : null,
    limit: state.configuration.limit,
    donutRadius: state.configuration.donutRadius,
    sliceCount: state.configuration.sliceCount,
    isMap: isMap(state),
    chartType: selectChartType(state),
    data: state.editor.widgetData,
    orderBy: state.configuration.orderBy,
    compact: state.theme.compact,
  }),
  { patchConfiguration }
)(EditorOptionsComponent);
