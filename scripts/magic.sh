# Set program variables
magick="/c/Program Files/ImageMagick/magick.exe"

for file in src/img/hero/lg/*; do
    file=$(basename -- "$file")
    "$magick" "src/img/hero/lg/$file" -resize 85%% "src/img/hero/$file"
done