#!/usr/bin/env sh
set -e

rm -rf build
yarn workspaces foreach --parallel run build

cp -r packages/backend/build/ build/
cp -r packages/frontend/build build/static
yarn pkg package.json
