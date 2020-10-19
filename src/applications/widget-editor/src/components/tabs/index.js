import { connectState } from "@widget-editor/shared/lib/helpers/redux";
import * as components from './component';

export const Tabs = connectState(
  state => ({
    theme: state.theme,
  }),
)(components.Tabs);

export const Tab = components.Tab;