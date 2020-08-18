import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import { selectDisabledFeatures } from "@widget-editor/shared/lib/modules/editor/selectors";

import DonutSlicesComponent from "./component";

export default connectState(
  state => ({
    disabledFeatures: selectDisabledFeatures(state),
  }),
)(DonutSlicesComponent);
