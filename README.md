# Widget editor V2

Playground: [here](https://vizzuality.github.io/widget-editor/)

This is the repo for the new version of the widget editor currently under development. Its mostly written in typescript with some exceptions and utilizing a mono-repo structure using yarn workspaces with Lerna.

## Getting started

1. Install packages in `root` by typing `yarn`
2. inside `widget-editor` add `.env` with these credentials:

```
NODE_ENV=develop
NODE_PATH=src
SASS_PATH=node_modules:src
```

3. Run `yarn start:widget-editor`. This will compile and watch all packages for changes.

Happy coding!

## Monorepo Structure

<img src="https://github.com/Vizzuality/widget-editor/blob/main/assets/widget-editor-packages.png" />

#### Managing packages

1. Install packages by in root writing `yarn` in the terminal. This will add all dependencies for all of the packages.
2. Start an application by running `yarn start:{widget-editor|renderer}`.
3. Run tests globally by running `yarn test` run them locally by running `yarn test:{@widget-editor|@widget-editor}/{package}`
4. Run linting by running `yarn lint`

#### Adding and managing packages

1. In applications `yarn workspace @widget-editor/{package} add {package}`
2. In packages `yarn workspace @widget-editor/{package} add {package}`

We recommend not adding packages globally (unless it's for building or dev dependencies), but if you have to you can run: `yarn add {package} --dev -W`

#### Application data flow

We are using Redux sagas for side effects. We are handling what should be updated with `@core/services/state-proxy` that will make sure we have changes. (more to be added)

<img src="https://github.com/Vizzuality/widget-editor/blob/main/assets/data-flow.png" />

#### Referencing packages within an application

You can reference packages by using this import format:

```
import package from "@widget-editor/{package}";
```

---

## Main entry point

Our main package that gets distributed to NPM is under `packages/widget-editor`.

Here we are exposing the editor, renderer, and redux related logic to the consumer. More documentation for the main package can be found [widget-editor](https://github.com/Vizzuality/widget-editor/blob/main/src/packages/widget-editor)

#### Applications

- [widget-editor](https://github.com/Vizzuality/widget-editor/blob/main/src/applications/widget-editor)

#### Packages

- [widget-editor](https://github.com/Vizzuality/widget-editor/tree/main/src/applications/widget-editor)
- [@widget-editor/core](https://github.com/Vizzuality/widget-editor/blob/main/src/packages/core)
- [@widget-editor/shared](https://github.com/Vizzuality/widget-editor/blob/main/src/packages/shared)
- [@widget-editor/renderer](https://github.com/Vizzuality/widget-editor/tree/main/src/applications/renderer)
- [@widget-editor/rw-adapter](https://github.com/Vizzuality/widget-editor/tree/main/src/adapters/rw-adapter)
- [@widget-editor/types](https://github.com/Vizzuality/widget-editor/blob/main/src/packages/types)

### Components

For our components we are using `styled-components` [documentation](https://www.styled-components.com/) .

## Migrating widgets

![Initial screen of the migration tool](https://github.com/Vizzuality/widget-editor/blob/main/assets/migration-tool.png)

The widget-editor includes an easy-to-use CLI that runs migrations for you. Once you've selected the version you want to migrate to, the CLI gives you 3 choices:
- Get the list of the widgets that need migration
- Perform a dry-run of the migration
- Perform the migration

Then, the migration tool will ask you for information such as which applications or which environments are targeted. If you want to perform the migration, you'll also have to provide your token (you need admin privileges).

Whichever option you select from the first screen, a complete report of the action will be generated in the folder you execute the command from.

To run the migration tool, execute:
```bash
$ yarn migrate
```

**This tool has been ported from v1 and was built with the RW API in mind.**
