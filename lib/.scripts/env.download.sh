#!/bin/bash

read -p "Provide an gist private key from env: " gist

git clone git@gist.github.com:$gist.git

cp ./cert.pem ./lib/.nginx/cert.pem
cp ./privkey.pem ./lib/.nginx/privkey.pem