#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | xargs)
fi

"C:\Program Files (x86)\WinSCP\WinSCP.com" << EOF
open ftp://$u:@$h -password=$p
rmdir public_html
put dist
mv dist public_html
EOF

rev=$(cat src/data/_REV)
v2=$(printf "v2.%03d" $(($rev - 346)))

echo "╭─────────────────────────────────────────────╮"
echo "│ Build $v2 pushed to server successfully. │"
echo "│         https://raritanlibrary.org/         │"
echo "╰─────────────────────────────────────────────╯"

exit 0