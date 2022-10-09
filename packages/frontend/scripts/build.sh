#!/usr/bin/env sh

rm -rf build/*
yarn graphql-type-gen
esbuild --bundle src/index.tsx --outdir=build/static --minify --define:SERVER_URL=\"https://dzbi8yrdpm1hx.cloudfront.net\"
esbuild --bundle src/serviceWorker.ts --outdir=build --minify
rsync -a public/* build --exclude static
