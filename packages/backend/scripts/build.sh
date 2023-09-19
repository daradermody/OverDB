#!/usr/bin/env sh
set -e

rm -rf build/*
bun graphql-type-gen
bun build src/index.ts --target bun --outfile build/backend.js --minify
cp src/schema.graphql build
