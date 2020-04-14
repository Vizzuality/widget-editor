import { connectState } from "@packages/shared/lib/helpers/redux";

import QueryLimitComponent from "./component";

export default connectState((state) => ({
  theme: state.theme,
}))(QueryLimitComponent);
