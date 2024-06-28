#!/bin/bash

set -o allexport
source .env
set -o allexport

rm -rf bin &&
npm unlink compare-json &&
rollup -c rollup.config.js &&
chmod +x $BIN_FILE &&
npm link &&
cj --test
