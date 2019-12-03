# Widget editor V2

This is the new version of the widget editor following the MVP pattern. The project is split into two sections `applications` and `packages` packages is holding all of our core logic consumed by our `applications`. Currently we have two applications using `react`. All of our `packages` are written in typescript.

## Getting started

We are using a `monorepo` structure using `yarn workspaces` combined with `lerna`.

1. Install packages by in root writing `yarn` in the terminal.
2. Start an individual application by running `yarn start:[widget-editor|renderer]`.
3. Run tests globaly by running `yarn test` run them localy by running `yarn test:[package]`

### What are the different packages?

1. `applications` any front end application consuming our `packages`
2. `packages` all of the core logic for the widget editor (written in typescript)

### Adding and managing packages

1. In applications `yarn workspace @applications/{package} add {package}`
2. In packages `yarn workspace @packages/{package} add {package}`

We recommend not adding packages in the global view (unless its for building or compiling in development), but if you have to you can run: `yarn add {package} --dev -W`

### Referencing packages

You can reference packages by using this import format:

```
import package from "@packages/{package}";
```
