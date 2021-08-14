#!/bin/sh
if [ $# -ne 1 ]; then
  echo "$0 site.example";
fi

cd "$1"
git rm -r "./$1/*"
cd -

wget --execute="robots = off" \
  --mirror \
  --no-parent --wait=1 \
  "$1" --verbose -o "wget-${1}-log.txt"

for file in $(find "$1"); do
 sed -i -E "s/data-cfemail=\"(.+)\"/data-cfemail=\"CLOUDFLARE_PROTECTED_EMAIL\"/" \
   "$file"
 sed -i -E "s/Cloudflare Ray ID: <strong[^>]+>(.+)<\/strong>/Cloudflare Ray ID: <strong>CLOUDFLARE_THING<\/strong>/" \
   "$file"
 sed -i -E "s/email-protection#[a-zA-Z0-9]+\"/email-protection#CLOUDFLARE_THING\"/" \
   "$file"
done

yarn run prettier --write "stores/$1"

cd "$1"
git add .

LastModify="$(curl -ILs "$1" | grep Last-Modified)"
LastModify=${LastModify:-Last-Modified: $(date)}
git commit -m "$LastModify"

