echo "Generating image files..."

# Make necessary folders
[[ ! -d "dist/img" ]] && mkdir "dist/img"
[[ ! -d "dist/img" ]] && mkdir "dist/img"

# Generate BookIt images
cp -r "src/img/bookit" "dist/img/bookit"

# Generate Event images
cp -r "src/img/events" "dist/img/events"

echo "Finished."