#!/usr/bin/env bash
# Tested in mac os zsh terminal
set -e
SED_PARAM=""
if [ "$(uname)" == "Darwin" ]; then
    SED_PARAM=\'\'
fi

#clean protos and proxies
rm -rf ./proto/sproxy
mkdir -p protos/proxy

PROTOC_GEN_TS_PATH="../node_modules/.bin/protoc-gen-ts";
OUT_DIR="./proxy";

cd protos
# generate proto proxy files
npx grpc_tools_node_protoc \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-node,mode=grpc-js:${OUT_DIR}" \
    --grpc_out=${OUT_DIR} --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    *.proto