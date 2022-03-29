# Pure utility
# Gallery --> -resize 400x400
# Crafts  --> -resize 600x600 -auto-orient -thumbnail 300x150^ -gravity center -extent 300x150

# Set program variables
magick="/c/Program Files/ImageMagick/magick.exe"

"$magick" "src/img/kids/--spring-bracelet.png" -resize "300x300!" "src/img/kids/spring-bracelet.png"

#for file in src/img/crafts/*; do
#    file=$(basename -- "$file")
#    "$magick" "src/img/crafts/$file" -resize 500x500 -auto-orient -thumbnail 300x150^ -gravity center -extent 300x150 "src/img/crafts/sm/$file"
#done