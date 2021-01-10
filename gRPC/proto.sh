#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)
PROTOBUF_ROOT=${PROJECT_ROOT}/protobuf

. ${PROTOBUF_ROOT}/tool.sh


GENERATE_TS "${PROJECT_ROOT}/react-app/src/grpc/generated"
GENERATE_NET "${PROJECT_ROOT}/dotnet/Server/Grpc/generated"