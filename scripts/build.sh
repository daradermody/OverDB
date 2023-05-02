#!/usr/bin/env sh
set -e

rm -rf build
yarn workspaces foreach --parallel run build

cp -r packages/backend/build/ build/
cp -r packages/frontend/build build/static
yarn nexe \
  --input build/backend.js \
  --output build/overdb \
  --target linux-x64-14.15.3 \
  --resource build/static \
  --resource build/static/.well-known \
  --resource build/schema.graphql \
  --resource build/xhr-sync-worker.js
