#!/bin/bash

# Проверить, что SSH_EMAIL установлен
if [ -z "$SSH_EMAIL" ]; then
  echo "SSH_EMAIL is not set. Please set SSH_EMAIL variable."
  exit 1
fi

# Вывести значение SSH_EMAIL в консоль
echo "SSH_EMAIL: $SSH_EMAIL"

# Генерация SSH-ключа и добавление в агент SSH
ssh-keygen -t ed25519 -C "$SSH_EMAIL" <<< $'\n\n\n'  # Пропускаем ввод пароля
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Вывести публичную часть SSH-ключа
cat ~/.ssh/id_ed25519.pub
