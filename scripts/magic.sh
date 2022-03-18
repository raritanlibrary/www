# Pure utility
# Gallery --> -resize 400x400
# Crafts  --> -resize 600x600 -auto-orient -thumbnail 300x150^ -gravity center -extent 300x150

magick="C:\Program Files\ImageMagick\magick.exe"

for file in src/img/crafts/*; do
    file=$(basename -- "$file")
    "$magick" "src/img/crafts/$file" -resize 500x500 -auto-orient -thumbnail 300x150^ -gravity center -extent 300x150 "src/img/crafts/sm/$file"
done