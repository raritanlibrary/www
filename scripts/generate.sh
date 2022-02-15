#!/bin/bash

echo "Generating static files..."

# Generate git data
rev=$(git rev-list --count main)
printf '%04d' $rev > src/data/_REV

# Make necessary folders
mkdir "dist/img"

# Copy static files
for static in "docs" "img/events" "img/kids" "img/news" "robots.txt" ".htaccess"; do
    cp -R "src/${static}" "dist/${static}"
done

echo "Finished generation."