#!/bin/sh

set -e
maxwidth="1600"  # in pixels, the widest image you want to allow.

#find all .jpg in current dir and subdirectories
FILES="$(find . -iname '*.png')"

for imagefile in $FILES
do
if [ -f "$imagefile" ]; then
imgwidth=`sips --getProperty pixelWidth "$imagefile" | awk '/pixelWidth/ {print $2}'`
else
    echo "Oops, "$imagefile" does not exist." 
    exit
fi

if [ $imgwidth -gt $maxwidth ]; then
    echo " - Image too big. Resizing..."
    sips --resampleWidth $maxwidth "$imagefile" > /dev/null 2>&1  # to hide sips' ugly output 
    imgwidth=`sips --getProperty pixelWidth "$imagefile" | awk '/pixelWidth/ {print $2}'`
    imgheight=`sips --getProperty pixelHeight "$imagefile" | awk '/pixelHeight/ {print $2}'`
    echo " - Resized "$imagefile" to $imgwidth""px wide by $imgheight""px tall";
fi
done
