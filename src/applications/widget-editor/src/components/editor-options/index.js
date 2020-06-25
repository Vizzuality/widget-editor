import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import EditorOptionsComponent from "./component";

export default connectState(
  (state) => ({
    disabledFeatures: state.editor.disabledFeatures,
    advanced: state.editor.advanced,
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
    isMap: state.configuration.chartType === "map",
    data: state.editor.widgetData,
    orderBy: state.configuration.orderBy,
    groupBy: state.configuration.groupBy,
    compact: state.theme.compact,
  }),
  { patchConfiguration }
)(EditorOptionsComponent);
