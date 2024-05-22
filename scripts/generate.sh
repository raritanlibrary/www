#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | xargs)
fi

echo "Generating static files..."

# Generate git data
git rev-list --count main > src/data/_REV
git rev-parse HEAD > src/data/_ID

# Make necessary folders
[[ ! -d "dist/docs" ]] && mkdir "dist/docs"

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

echo "Finished."