import { connectState } from "helpers/redux";
import { patchConfiguration } from "modules/configuration/actions";
import EditorOptionsComponent from "./component";

export default connectState(
  state => ({
    datasetId:
      state.editor.dataset && state.editor.dataset.id
        ? state.editor.dataset.id
        : null,
    limit: state.configuration.limit,
    orderBy: state.configuration.orderBy,
    compact: state.theme.compact
  }),
  { patchConfiguration }
)(EditorOptionsComponent);
