import { connectState } from '@widget-editor/shared/lib/helpers/redux';

import {
  setEditor,
  resetEditor
} from '@widget-editor/shared/lib/modules/editor/actions';
import { resetConfiguration } from '@widget-editor/shared/lib/modules/configuration/actions';
import { resetWidgetConfig } from '@widget-editor/shared/lib/modules/widget-config/actions';
import {
  setFilters,
  resetFilters
} from '@widget-editor/shared/lib/modules/filters/actions';
import { selectHasGeoInfo } from '@widget-editor/shared/lib/modules/editor/selectors';

import {
  setTheme,
  setSchemes,
  resetTheme
} from '@widget-editor/shared/lib/modules/theme/actions';

// Components
import EditorComponent from './component';

export default connectState(
  state => ({
    editor: state.editor,
    theme: state.theme,
    configuration: state.configuration,
    widget: state.widgetConfig,
    editorState: state,
    hasGeoInfo: selectHasGeoInfo(state),
    initialized: state.editor.initialized,
  }),
  dispatch => {
    return {
      dispatch,
      resetConfiguration: () => dispatch(resetConfiguration()),
      resetTheme: () => dispatch(resetTheme()),
      resetEditor: () => dispatch(resetEditor()),
      resetWidgetConfig: () => dispatch(resetWidgetConfig()),
      setFilters: data => dispatch(setFilters(data)),
      resetFilters: () => dispatch(resetFilters()),
      setEditor: data => dispatch(setEditor(data)),
      setTheme: data => dispatch(setTheme(data)),
      setSchemes: data => dispatch(setSchemes(data))
    };
  }
)(EditorComponent);
