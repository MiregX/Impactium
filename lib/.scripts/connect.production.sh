#!/bin/bash

read -p "Enter a password here: " password

plink -ssh -pw "$password" root@77.221.156.155 << EOF
EOF
