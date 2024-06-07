#!/bin/bash

set +e
set -a
source .env
set +a

echo $SSH_EMAIL

sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_IP"