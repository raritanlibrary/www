#!/bin/bash

echo "Generating static files..."

# Generate git data
rev=$(git rev-list --count main)
printf '%04d' $rev > src/data/_REV

# Make necessary folders
[[ ! -d "dist/docs" ]] && mkdir "dist/docs"
[[ ! -d "dist/img" ]] && mkdir "dist/img"

# Copy static files
for static in "docs/events" "img/events" "img/kids" "img/news" "img/promo" "robots.txt" ".htaccess"; do
    [[ ! -d "dist/${static}" ]] && cp -R "src/${static}" "dist/${static}"
done

echo "Finished generation."