#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Set program variables
magick="/c/Program Files/ImageMagick/magick.exe"

echo "Generating static files..."

# Generate git data
rev=$(git rev-list --count main)
printf '%04d' $rev > src/data/_REV

# Make necessary folders
[[ ! -d "dist/docs" ]] && mkdir "dist/docs"
[[ ! -d "dist/img" ]] && mkdir "dist/img"

# Copy other static files
for static in "docs/events" "robots.txt" ".htaccess"; do
    [[ ! -d "dist/${static}" ]] && cp -R "src/${static}" "dist/${static}"
done

# Set variables for url and payload
url="https://raritanlibrary.libcal.com/1.1"
payload="client_id=$LIBCAL_ID&client_secret=$LIBCAL_SECRET&grant_type=client_credentials"

# Get and parse oauth token
tokenRaw=`curl -Ls -X POST "$url/oauth/token" -d "$payload"`
token=`grep -oP '(?<=:")[\w]{32,}' <<< "$tokenRaw"`

# Get proper date for API call
year=$(date --date="$(date) - 45 day" +%Y)
month=$(date --date="$(date) - 45 day" +%B)

# Get and save events data to json file
curl -Ls -X GET "$url/events?cal_id=16676&days=160&limit=500&date=$year-$month-01" -H "Authorization: Bearer $token" > src/data/calendar.json

# Download all event images into dist/img/events
#grep -oP '"id":(\d+),"title"|"featured_image":"(.*?)",' src/data/calendar.json

echo "Finished generation."