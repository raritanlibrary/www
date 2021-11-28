#!/bin/bash

if [ -f .env ]
then
    export $(cat new.env | xargs)
fi

"C:\Program Files\7-Zip\7z.exe" a www.zip "dist\\"
"C:\Program Files\7-Zip\7z.exe" rn www.zip dist www
"C:\Program Files (x86)\WinSCP\WinSCP.com" << EOF
open ssh://$u:@$h -privatekey=$k
put www.zip
rmdir www
call cd C:/Users/Administrator.RPL/Downloads && unzip www.zip
rm www.zip
EOF
rm www.zip