#!/bin/bash

if [ -f .env ]
then
    export $(cat .env | xargs)
fi
"C:\Program Files (x86)\WinSCP\WinSCP.com" << EOF
open ftp://$u:$p@$h
synchronize remote dist www
EOF