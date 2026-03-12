#!/usr/bin/env bash
# Generate icons for the extension.

if ! command -v inkscape &> /dev/null; then
  echo "Inkscape not found, please install it."
  exit 1
fi

for size in 16 32 48 96 128; do
  inkscape --export-type=png \
    --export-width=$size \
    --export-height=$size \
    --export-filename="apps/extension/public/icon/${size}.png" \
    "packages/ui/src/logo.svg"
done
