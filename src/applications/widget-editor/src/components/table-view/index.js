import { connectState } from "@widget-editor/shared/lib/helpers/redux";

import TableView from "./component";

export default connectState((state) => ({
  widgetData: state.editor.widgetData,
  configuration: state.configuration,
}))(TableView);
