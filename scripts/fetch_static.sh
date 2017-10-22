#!/bin/bash
DOWNLOAD_URL=$(curl -s https://api.github.com/repos/kak-bo-che/quelab-web-signin/releases/latest |\
               jq -r .assets[0].browser_download_url)