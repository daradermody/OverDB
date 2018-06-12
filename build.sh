#!/usr/bin/env bash

set -e  # Exit if any command fails
cd $(dirname $0)

# Build front-end
$(npm bin)/ng build --prod --aot

# Compile server-side
$(npm bin)/tsc --project server/tsconfig.server.json
