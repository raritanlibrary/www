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

echo "╭───────────────────────────────────────────╮"
echo "│ Build $(cat src/data/_REV) pushed to server successfully. │"
echo "│        https://raritanlibrary.org/        │"
echo "╰───────────────────────────────────────────╯"

exit 0