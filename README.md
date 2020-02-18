# Widget editor V2

This is the repo for the new version of the widget editor currently under development. Its mostly written in typescript with some exceptions and utilizing a mono-repo structure using yarn workspaces with Lerna.

## Getting started

1. Install packages in `root` by typing `yarn`
2. inside `@applications/widget-editor` add `.env` with these credentials:

```
NODE_ENV=develop
NODE_PATH=src
SASS_PATH=node_modules:src
```

3. Run `yarn start:widget-editor`. This will compile and watch all packages for changes.

Happy coding!

## Monorepo Structure

<img src="https://github.com/Vizzuality/widget-editor/blob/master/assets/widget-editor-packages.png" />

#### Managing packages

1. Install packages by in root writing `yarn` in the terminal. This will add all dependencies for all of the packages.
2. Start an application by running `yarn start:{widget-editor|renderer}`.
3. Run tests globally by running `yarn test` run them locally by running `yarn test:{@applications|@packages}/{package}`
4. Run linting by running `yarn lint`

#### Adding and managing packages

1. In applications `yarn workspace @applications/{package} add {package}`
2. In packages `yarn workspace @packages/{package} add {package}`

We recommend not adding packages globally (unless it's for building or dev dependencies), but if you have to you can run: `yarn add {package} --dev -W`

#### Application data flow

We are using Redux sagas for side effects. We are handling what should be updated with `@core/services/state-proxy` that will make sure we have changes. (more to be added)

<img src="https://github.com/Vizzuality/widget-editor/blob/master/assets/data-flow.png" />

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
