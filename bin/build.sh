rm -rf ./src/applications/widget-editor/src/shared

mkdir ./src/applications/widget-editor/src/shared
mkdir ./src/applications/widget-editor/src/shared/packages
mkdir ./src/applications/widget-editor/src/shared/adapters

mv ./src/adapters/rw-adapter/build ./src/applications/widget-editor/src/shared/adapters/rw-adapter

mv ./src/packages/shared/lib ./src/applications/widget-editor/src/shared/shared
mv ./src/applications/renderer/lib ./src/applications/widget-editor/src/shared/renderer

mv ./src/packages/core/build ./src/applications/widget-editor/src/shared/packages/core
mv ./src/packages/types/build ./src/applications/widget-editor/src/shared/packages/types

cd ./src/applications/widget-editor && yarn buildme


