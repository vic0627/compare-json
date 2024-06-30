#!/bin/bash

set -o allexport
source .env
set -o allexport

rm -rf bin &&
	npm unlink compare-json &&
	rollup -c rollup.config.js &&
	chmod +x "./dist/bin/${PKG_NAME}.cjs" &&
	npm link &&
	cj --test
