#!/usr/bin/env sh
set -e

rm -rf build/*
yarn graphql-type-gen
esbuild --bundle src/index.tsx --outdir=build --minify
esbuild --bundle src/serviceWorker.ts --outdir=build --minify
rsync -a public/* build --exclude static
