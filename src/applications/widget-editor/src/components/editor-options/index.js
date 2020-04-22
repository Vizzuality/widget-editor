import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import EditorOptionsComponent from "./component";

export default connectState(
  (state) => ({
    disabledFeatures: state.editor.disabledFeatures,
    datasetId:
      state.editor.dataset && state.editor.dataset.id
        ? state.editor.dataset.id
        : null,
    limit: state.configuration.limit,
    donutRadius: state.configuration.donutRadius,
    slizeCount: state.configuration.slizeCount,
    isMap: state.configuration.chartType === "map",
    data: state.editor.widgetData,
    orderBy: state.configuration.orderBy,
    groupBy: state.configuration.groupBy,
    compact: state.theme.compact,
  }),
  { patchConfiguration }
)(EditorOptionsComponent);
