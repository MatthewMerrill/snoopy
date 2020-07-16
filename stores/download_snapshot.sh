#!/bin/sh
if [ $# -ne 1 ]; then
  echo "$0 site.example";
fi

rm -r "./$1/*"

wget --execute="robots = off" \
  --mirror --convert-links \
  --no-parent --wait=.1 \
  "$1"

for file in $(find "$1" | grep -E "\.html$"); do
 sed -i -E "s/data-cfemail=\"(.+)\"/data-cfemail=\"CLOUDFLARE_PROTECTED_EMAIL\"/" \
   "$file"
done

yarn run prettier --write "stores/$1"

git add .
git commit -m "$(curl -ILs "$1" | grep Last-Modified)"