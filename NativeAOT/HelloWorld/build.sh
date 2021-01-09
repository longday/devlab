#!/usr/bin/env bash

set +x

#Ubuntu 20.04 deps
#sudo apt install clang libtinfo5 libkrb5-dev zlib1g-dev


dotnet \
    publish \
    -r linux-x64 \
    #-p:PublishSingleFile=true \
    #--self-contained true \
    -c release

ls -lah bin/release/net5.0/linux-x64/native