import * as Widget from './widget';

export type ObjectPayload = object[];
export type Dispatcher = (object) => void;
export type Array = any[];
export type ReduxStore = any;
export type OutputPayload = {
  name: string,
  description: string,
  widgetConfig: Widget.WidgetConfig,
  metadata: {
    caption: string,
  },
};
