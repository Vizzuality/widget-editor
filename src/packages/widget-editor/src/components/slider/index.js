import { connectState } from "@packages/shared/lib/helpers/redux";

import SliderComponent from "./component";

export default connectState((state) => ({
  theme: state.theme,
}))(SliderComponent);
