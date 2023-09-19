#!/usr/bin/env sh
set -e

rm -rf build/*
bun graphql-type-gen
bun build src/index.tsx src/serviceWorker.ts --outdir build --minify
rsync -a public/* public/.well-known build/ --exclude static
