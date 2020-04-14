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

# All properties listed

```jsx
import WidgetEditor, { RwAdapter } from "widget-editor";

<WidgetEditor
  disable={[string]}
  schemes={[theme_objects]}
  datasetId="string"
  widgetId="string"
  adapter={RwAdapter}
/>;
```

# Using the renderer

The renderer allows you to render a chart based on a widget configuration. It takes one parameter, which is a widget configuration.

```jsx
import { Renderer } from "widget-editor";

const App = () => {
  return <Renderer widgetConfig={...} />;
};
```
