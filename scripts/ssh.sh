#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Set program variables
p7zip="/c/Program Files\7-Zip\7z.exe"

"$p7zip" a www.zip "dist\\"
"$p7zip" rn www.zip dist www
"C:\Program Files (x86)\WinSCP\WinSCP.com" << EOF
open ssh://$u:@$h -privatekey=$k
put -delete www.zip 
rmdir www
call cd c && unzip -o www.zip
rm www.zip
EOF

echo "╭───────────────────────────────────────────╮"
echo "│ Build $(cat src/data/_REV) pushed to server successfully. │"
echo "│        https://raritanlibrary.org/        │"
echo "╰───────────────────────────────────────────╯"

exit 0