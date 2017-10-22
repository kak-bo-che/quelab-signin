#!/bin/bash
DESTINATION_DIR=$1
DOWNLOAD_URL=$(curl -s https://api.github.com/repos/kak-bo-che/quelab-web-signin/releases/latest |\
               jq -r .assets[0].browser_download_url)
echo downloading from $DOWNLOAD_URL
curl -s -L -O $DOWNLOAD_URL
if [ -d "$DESTINATION_DIR" ]; then
    rm -rf "$DESTINATION_DIR"
    mkdir "$DESTINATION_DIR"
else
    mkdir "$DESTINATION_DIR"
fi
echo extracting to $DESTINATION_DIR
tar -xzvf dist.tar.gz -C "$DESTINATION_DIR" --strip-components=1