# Widget editor V2

This is the new version of the widget editor following the MVP pattern. The project is split into two sections `applications` and `packages` packages are holding all of our core logic consumed by our `applications`. Currently, we have two applications using `react`. All of our `packages` are written in typescript.

## Getting started

We are using a `mono repo` structure using `yarn workspaces` combined with `lerna`. The project is split into two categories `applications` & `packages`.

#### Applications

This is code that will be directly served and interacted with a user, these apps are using react and they are consuming the `packages`

#### Managing packages

All core logic consumed by the applications. These are all written in `typescript`

1. Install packages by in root writing `yarn` in the terminal. This will add all dependencies for all of the packages.
2. Start an application by running `yarn start:{widget-editor|renderer}`.
3. Run tests globally by running `yarn test` run them locally by running `yarn test:{@applications|@packages}/{package}`

#### Adding and managing packages

1. In applications `yarn workspace @applications/{package} add {package}`
2. In packages `yarn workspace @packages/{package} add {package}`

We recommend not adding packages globally (unless it's for building or dev dependencies), but if you have to you can run: `yarn add {package} --dev -W`

#### Referencing packages within an application

You can reference packages by using this import format:

```
import package from "@packages/{package}";
```

---

## Packages documentation

#### Applications

- [@applications/renderer](https://github.com/Vizzuality/widget-editor/blob/master/src/applications/renderer)
- [@applications/widget-editor](https://github.com/Vizzuality/widget-editor/blob/master/src/applications/widget-editor)

#### Packages

- [@packages/core](https://github.com/Vizzuality/widget-editor/blob/master/src/packages/core)
- [@packages/rw-adapter](https://github.com/Vizzuality/widget-editor/blob/master/src/packages/rw-adapter)
- [@packages/types](https://github.com/Vizzuality/widget-editor/blob/master/src/packages/types)

### Components

For our components we are using `styled-components` [documentation](https://www.styled-components.com/) More to be documented.

## General notes

If you're working with an application and update a package, you need to re-run the start application command so all the TS code will be re-compiled and understood by the react application.
