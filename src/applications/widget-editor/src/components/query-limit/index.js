import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import QueryLimitComponent from "./component";

export default connectState((state) => ({
  theme: state.theme,
}))(QueryLimitComponent);
