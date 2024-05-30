#!/bin/bash

DEV_ENV="https://gist.githubusercontent.com/Mireg-V/1afb20ebd7f0e4738b9b6c1f54138388/raw/2c8f9aee07a72d46594d17c40214c9eeb60ff6bc/.env"
# PROD_ENV="nv"
CERT="https://gist.githubusercontent.com/Mireg-V/1afb20ebd7f0e4738b9b6c1f54138388/raw/2c8f9aee07a72d46594d17c40214c9eeb60ff6bc/cert.pem"
PRIVKEY="https://gist.githubusercontent.com/Mireg-V/1afb20ebd7f0e4738b9b6c1f54138388/raw/2c8f9aee07a72d46594d17c40214c9eeb60ff6bc/privkey.pem"

download_file() {
    local url=$1
    local output=$2

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -o "$output" "$url"
    elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32" ]]; then
        curl.exe -o "$output" "$url"
    else
        echo "Unsupported OS"
        exit 1
    fi
}

download_file "$DEV_ENV" "../../.env"
download_file "$CERT" "../.nginx/cert.pem"
download_file "$PRIVKEY" "../.nginx/privkey.pem"

echo "Files downloaded successfully."
