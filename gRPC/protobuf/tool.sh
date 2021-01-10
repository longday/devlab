#!/usr/bin/env bash
trap 'echo "Exit"; exit 1' INT

NUGET_VERSION="2.34.0"
TS_PROTO_VERSION="1.41.1"
GRPC_TOOLS="1.10.0"

if [ -z "$PROJECT_ROOT" ]
then
    echo "PROJECT_ROOT VAR is not set"
    exit 1;
fi

if [ -z "$PROTOBUF_ROOT" ]
then
    echo "PROTOBUF_ROOT VAR is not set"
    exit 1;
fi


TOOLS_ROOT="${PROTOBUF_ROOT}/tools/N${NUGET_VERSION}_T${TS_PROTO_VERSION}_G${GRPC_TOOLS}"
PROTO_ROOT="${PROTOBUF_ROOT}/proto"

#rm -rf $TOOLS_ROOT


### Check if a directory does not exist ###
if [ ! -d "${TOOLS_ROOT}" ]
then
    echo "Install tooling..."
    mkdir -p $TOOLS_ROOT
    (cd $TOOLS_ROOT \
        && wget -O nuget.zip "https://www.nuget.org/api/v2/package/Grpc.Tools/${NUGET_VERSION}" \
        && unzip nuget.zip "tools/linux_x64/grpc_csharp_plugin" -d dotnet \
        && chmod +x "dotnet/tools/linux_x64/grpc_csharp_plugin" \
        && rm nuget.zip \
        && npm init -y \
        && npm i grpc-tools@${GRPC_TOOLS} ts-proto@${TS_VERSION} --save-exact
    )
fi


#https://github.com/stephenh/ts-proto#usage
function GENERATE_TS() {
    rm -rf $1 && mkdir -p $1
    ( cd $PROTO_ROOT && \
        "${TOOLS_ROOT}/node_modules/grpc-tools/bin/protoc" \
        --plugin="${TOOLS_ROOT}/node_modules/ts-proto/protoc-gen-ts_proto" \
        --ts_proto_out=$1 *.proto \
        --ts_proto_opt=\
context=false,\
forceLong=long,\
env=both,\
useOptionals=true,\
oneof=unions,\
unrecognizedEnum=false,\
lowerCaseServiceMethods=true,\
snakeToCamel=true,\
outputEncodeMethods=true,\
outputJsonMethods=true,\
stringEnums=false,\
outputClientImpl=grpc-web,\
returnObservable=false,\
useDate=true
    )
}

# https://chromium.googlesource.com/external/github.com/grpc/grpc/+/HEAD/src/csharp/BUILD-INTEGRATION.md#command-line-options
function GENERATE_NET() {
    rm -rf $1 && mkdir -p $1
    ( cd $PROTO_ROOT && \
        "${TOOLS_ROOT}/node_modules/grpc-tools/bin/protoc" \
        --plugin="protoc-gen-grpc=${TOOLS_ROOT}/dotnet/tools/linux_x64/grpc_csharp_plugin" \
        --csharp_out=$1 \
        --grpc_out=$1 \
        --grpc_opt=no_client \
        *.proto
    )
}





