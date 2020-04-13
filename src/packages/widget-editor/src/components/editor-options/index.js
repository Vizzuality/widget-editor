import { connectState } from "@packages/shared/lib/helpers/redux";

import { patchConfiguration } from "@packages/shared/lib/modules/configuration/actions";
import EditorOptionsComponent from "./component";

export default connectState(
  (state) => ({
    datasetId:
      state.editor.dataset && state.editor.dataset.id
        ? state.editor.dataset.id
        : null,
    limit: state.configuration.limit,
    orderBy: state.configuration.orderBy,
    groupBy: state.configuration.groupBy,
    compact: state.theme.compact,
  }),
  { patchConfiguration }
)(EditorOptionsComponent);
