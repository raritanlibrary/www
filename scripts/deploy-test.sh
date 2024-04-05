#!/bin/bash

hash=$(git rev-parse --short HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)

# Add CNAME
echo 'new.raritanlibrary.org' >> dist/CNAME

# Check if clean
if [[ $(git status --porcelain) ]]; then
    echo "Not clean! Exiting..."
    exit 1
fi

# Check for branch conflicts
if [[ $(git branch --list gh-pages) ]]; then
    echo "Local \"gh-pages\" branch already exists! Exiting..."
    exit 1
fi

# Checkout branch
git --work-tree dist checkout --orphan gh-pages

# Add dir
git --work-tree dist add --all

# Commit dir
git --work-tree dist commit -m $hash

# Push to remote
git push origin HEAD:gh-pages --force

# Reset branch
git checkout -f $branch

# Delete
git branch -D gh-pages