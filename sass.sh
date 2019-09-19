#!/bin/bash

if [ -x node_modules/.bin/node-sass ]; then
  # node-sass is faster, but regularly fails to build correctly
  node-sass --source-map=true $@
else
  # fallback to the official transpiled version
  sass --source-map=true $@
fi
