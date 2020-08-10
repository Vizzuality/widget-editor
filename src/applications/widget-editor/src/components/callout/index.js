import { connectState } from '@widget-editor/shared/lib/helpers/redux';
import { selectThemeColor } from '@widget-editor/shared/lib/modules/theme/selectors';

import Component from './component';

export default connectState(
  state => ({
    themeColor: selectThemeColor(state),
  }),
)(Component);
