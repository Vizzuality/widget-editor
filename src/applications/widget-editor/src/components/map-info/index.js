import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

// Components
import MapInfoComponent from "./component";

export default connectState(
  (state) => ({
    editor: state.editor,
    configuration: state.configuration,
  }),
  { patchConfiguration }
)(MapInfoComponent);
