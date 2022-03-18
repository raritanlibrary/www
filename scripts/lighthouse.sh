#!/bin/bash

# Calculate timestamp and make a directory with it
timestamp=$(date +%y%m%d)
mkdir reports/$timestamp
mkdir reports/$timestamp/mobile
mkdir reports/$timestamp/desktop

# Generate report for each .pug file
for file in ./src/*; do
    if ! [[ -d $file ]]; then
        file=$(basename -- "$file")
        fname="${file%.*}"
        if [[ $fname == "index" ]]; then
           echo "Generating reports for index.html..."
           lighthouse "https://raritanlibrary.org" --quiet=true --chrome-flags="--headless" --output=html --preset=desktop --output-path=reports/$timestamp/desktop/$fname.html
           lighthouse "https://raritanlibrary.org" --quiet=true --chrome-flags="--headless" --output=html --output-path=reports/$timestamp/mobile/$fname.html
        elif [[ $fname != "$" ]] && [[ $fname != "robots" ]]; then
           echo "Generating reports for ${fname}.html..."
           lighthouse "https://raritanlibrary.org/${fname}" --quiet=true --chrome-flags="--headless" --output=html --preset=desktop --output-path=reports/$timestamp/desktop/$fname.html
           lighthouse "https://raritanlibrary.org/${fname}" --quiet=true --chrome-flags="--headless" --output=html --output-path=reports/$timestamp/mobile/$fname.html
        fi
    fi
done