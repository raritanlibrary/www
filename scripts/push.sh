#!/bin/bash

git add -A
echo "                ──────────────────────────────────────────────────"
read -r -p "Commit message: " input
if [[ -z $input ]]; then
    echo "No commit message found! Exiting..."
    exit 1
else
    git commit -am "$input"
    git push origin main
fi