import { connectState } from '@widget-editor/shared/lib/helpers/redux';
import { editorSyncMap } from '@widget-editor/shared/lib/modules/editor/actions';
import { patchConfiguration } from '@widget-editor/shared/lib/modules/configuration/actions';

import Component from "./component";

export default connectState(state => ({
  editor: state.editor,
  widgetConfig: state.widgetConfig,
  configuration: state.configuration,
  compact: state.theme.compact.isCompact || state.theme.compact.forceCompact,
}), {
  editorSyncMap,
  patchConfiguration,
})(Component);