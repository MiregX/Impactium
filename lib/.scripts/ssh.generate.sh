#!/bin/bash

read -p "Введите вашу почту: " user_email

ssh-keygen -t ed25519 -C "$user_email" <<< "$(printf '\n\n\n')"

eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_ed25519

cat ~/.ssh/id_ed25519.pub