#!/usr/bin/env sh
set -e

rm -rf build/*
yarn graphql-type-gen
yarn esbuild \
  --bundle \
  --target=node14 \
  --platform=node \
  src/index.ts \
  --outfile=build/backend.js \
  --define:process.env.NODE_ENV=\"production\" \
  --external:canvas \
  --external:./xhr-sync-worker.js
touch build/xhr-sync-worker.js
cp src/schema.graphql build
