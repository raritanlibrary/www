#!/bin/bash

# Set program variables
magick="C:\Program Files\ImageMagick\magick.exe"

echo "Generating static files..."

# Generate git data
rev=$(git rev-list --count main)
printf '%04d' $rev > src/data/_REV

# Make necessary folders
[[ ! -d "dist/docs" ]] && mkdir "dist/docs"
[[ ! -d "dist/img" ]] && mkdir "dist/img"

# Copy + transform static images
for static in "events" "kids" "news" "promo"; do
    [[ ! -d "dist/img/${static}" ]] && mkdir "dist/img/${static}"
    staticPath="src/img/${static}/*"
    for file in $staticPath; do
        file=$(basename -- "$file")
        fname="${file%.*}"
        ftype="${file##*.}"
        if [[ $ftype == "gif" ]]; then
            cp "src/img/${static}/${file}" "dist/img/${static}/${file}"
        else
            "$magick" -quality 80 "src/img/${static}/${fname}.${ftype}" "dist/img/${static}/${fname}.jpg"
        fi
        "$magick" -quality 80 "src/img/${static}/${fname}.${ftype}" "dist/img/${static}/${fname}.webp"
    done
done

# Copy other static files
for static in "docs/events" "robots.txt" ".htaccess"; do
    [[ ! -d "dist/${static}" ]] && cp -R "src/${static}" "dist/${static}"
done

echo "Finished generation."