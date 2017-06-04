#!/bin/bash -e
#
# copy from https://developer.chrome.com/extensions/crx
# Purpose: Pack a Chromium extension directory into crx format

PACKAGE_VERSION=$(cat chrome/manifest.json | grep version | tail -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
echo "start packing version $PACKAGE_VERSION"

# if test $# -ne 3; then
#   echo "Usage: crxmake.sh <extension dir> <pem path> <output file name>"
#   exit 1
# fi

crx="rain-it"
dir="chrome"
key="dist/$crx.pem"
outname="$crx-v$PACKAGE_VERSION"
name=$(basename "$dir")
crx="$outname.crx"
pub="$name.pub"
sig="$name.sig"
zip="$name.zip"
trap 'rm -f "$pub" "$sig" "$zip"' EXIT

# zip up the crx dir
cwd=$(pwd -P)
(cd "$dir" && zip -qr -9 -X "$cwd/$zip" .)

# signature
openssl sha1 -sha1 -binary -sign "$key" < "$zip" > "$sig"

# public key
openssl rsa -pubout -outform DER < "$key" > "$pub" 2>/dev/null

byte_swap () {
  # Take "abcdefgh" and return it as "ghefcdab"
  echo "${1:6:2}${1:4:2}${1:2:2}${1:0:2}"
}

crmagic_hex="4372 3234" # Cr24
version_hex="0200 0000" # 2
pub_len_hex=$(byte_swap $(printf '%08x\n' $(ls -l "$pub" | awk '{print $5}')))
sig_len_hex=$(byte_swap $(printf '%08x\n' $(ls -l "$sig" | awk '{print $5}')))
(
  echo "$crmagic_hex $version_hex $pub_len_hex $sig_len_hex" | xxd -r -p
  cat "$pub" "$sig" "$zip"
) > "$crx"
mv $crx dist/
echo "$crx package ready"