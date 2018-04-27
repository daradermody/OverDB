#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color

classes=$(egrep '(:?\s|^)\.[a-zA-Z0-9\-]+\b' --only-matching --no-filename --recursive --include='*.css' --exclude-dir='node_modules' --exclude-dir='assets' --exclude-dir='dist' . | awk -F\. '{print $2}' | sort | uniq)

unused_classes=""
for class in ${classes}; do
    grep ${class} --recursive --include='*.html' . > /dev/null
    if [[ $? -ne 0 ]] ; then
        unused_classes="${unused_classes}    ${class}\n"
    fi;

done

if [[ -n ${unused_classes} ]]; then
    echo -e "${RED}The following CSS classes are not used in HTML:${NC}"
    echo -e "${unused_classes}"
    exit 1
fi

exit 0
