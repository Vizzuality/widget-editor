# Widget editor V2

This is the second iteration of the widget editor. The widget editor is a tool to generate charts based on vega configurations. You can plug in any api using Adapters. Currently, we support out of the box the resource watch API.

## Getting started

Installing through NPM `npm install widget-editor`

Instaling with Yarn(v1) `yarn install widget-editor`

There are two parts to the editor. Eather, you can use the entire editor by merely importing the `WidgetEditor` component. Or if you want to display the configured charts, you should import the `Renderer`.

## Using the editor

```jsx
import WidgetEditor from "widget-editor";

const App = () => {
  return <WidgetEditor />;
};
```

The editor has a few properties, some required. Below you have all properties listed.

## adapter (required)

First of all, we need to plug in an `adapter` to the editor. This adapter is responsible for proxying and resolving any necessary information into the editor itself. Currently, we only have an adapter written for the resource watch API.

## datasetId (required)

This tells the editor what dataset to utilize. (note\* this might change in the future)

## widgetId

widgetId is used together with a datasetId. This will make another request fetching the necessary widget.

## schemes

Schemes allow you to add custom themes to the editor. This takes an array of objects of this format:

```json
{
  "name": "theme name",
  "mainColor": "#hex",
  "category": ["#hex"]
}
```

## compact (boolean, default false)

This property renders the editor in a compact mode. By default, the editor is a two-column layout. Enabling this setting will render one column & overlay the options.

## disable

This property allows you to disable specific features in the editor, read more here.

## areaIntersection

`areaIntersection` is a string representing the ID of an area (geostore ID in RW).

When `areaIntersection` is set, it is used as a default geographic filter for the dataset/widget. Even if the widget already has a geographic filter, it will be overwritten by the value of `areaIntersection`. Yet, the user will still be able to change the geographic filter in the UI.

If the `areaIntersection` prop is later removed, the widget-editor will remove the geographic filter instead of restoring the widget's original filter value.

If the `areaIntersection` is a user's area, the widget-editor's adapter must receive the user's token as `userToken` in order to correctly display the name of the area, otherwise, it will be shown as “Custom area”.

If the dataset doesn't provide geographic information, this property is ignored.

# All properties listed

```jsx
import WidgetEditor, { RwAdapter } from "widget-editor";

<WidgetEditor
  disable={[string]}
  schemes={[theme_objects]}
  datasetId="string"
  widgetId="string"
  areaIntersection="string"
  adapter={RwAdapter}
/>;
```

# Using the renderer

The renderer allows you to render a chart based on a widget configuration.

```jsx
import { Renderer, RwAdapter } from "widget-editor";

const App = () => {
  return <Renderer adapter={RwAdapter} widgetConfig={...} />;
};
```
