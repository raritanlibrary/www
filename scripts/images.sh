# Set program variables
magick="/c/Program Files/ImageMagick/magick.exe"

echo "Generating image files..."

# Make necessary folders
[[ ! -d "dist/img" ]] && mkdir "dist/img"
[[ ! -d "dist/img/events" ]] && mkdir "dist/img/events"
[[ ! -d "dist/img/events/tmp" ]] && mkdir "dist/img/events/tmp"

# Parse the JSON file we're using to download the images
eventImagesRaw=( $(grep -oP '(?<="id":)(\d+)(?=,"title")|(?<="featured_image":")(.*?)(?=")' "src/data/calendar.json") )

# If the ID has an image, download/manipulate it
# If not, copy the sample image and assign it
for (( i=0; i<="${#eventImagesRaw[@]}"; i++ )); do
    val="${eventImagesRaw[$i]}"
    valNext="${eventImagesRaw[i+1]}"
    # ID sanity check
    if [[ "$val" != "https"* ]]; then
        if [[ "$valNext" == "https"* ]]; then
            # file ext
            curl -s "$valNext" > "dist/img/events/tmp/$val.${valNext##*.}"
            i=$((i+1))
        else
            # Placeholder image uses 1:1 Twitter logo
            cp "src/img/main-twit.png" "dist/img/events/tmp/$val.png";
        fi
    fi
done

# Now, loop through all the images, build a hashcache
declare -A hashCache
for i in dist/img/events/tmp/*; do
    fname=$(basename ${i})
    md5=$(md5sum $i | cut -c1-12)
    if [ -z ${hashCache[$md5]} ]; then
        hashCache[$md5]="${fname%.*}"
    else
        hashCache[$md5]+=",${fname%.*}"
    fi
done

# Save the hashcache in JSON format
# Use the hashcache to generate new images
hashCacheJSON="{"
for i in "${!hashCache[@]}"; do
    hashCacheJSON+="\"$i\":[${hashCache[$i]}], "
    cacheMatch=$(find -name "${hashCache[$i]:0:8}.*")
    magick convert "$cacheMatch" -gravity center -crop 1:1 -resize 300x300 "dist/img/events/$i.jpg";
    magick convert "dist/img/events/$i.jpg" -quality 80 -define webp:alpha-quality=80 -define webp:method=6 "dist/img/events/$i.webp";
done

# Update hashcache, remove temp images folder
echo "${hashCacheJSON::-2}}" > src/data/hashcache.json
rm -rf "dist/img/events/tmp"

echo "Finished."