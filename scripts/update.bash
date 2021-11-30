#!/bin/bash

if [ -f .env ]
then
    export $(cat .env | xargs)
fi

"C:\Program Files\7-Zip\7z.exe" a www.zip "dist\\"
"C:\Program Files\7-Zip\7z.exe" rn www.zip dist www
"C:\Program Files (x86)\WinSCP\WinSCP.com" << EOF
open ssh://$u:@$h -privatekey=$k
cd /
put -delete www.zip 
rmdir www
call unzip www.zip && rm www.zip
EOF