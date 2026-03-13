#!/usr/bin/env bash
# Generate icons for the extension.

if ! command -v inkscape &> /dev/null; then
  echo "Inkscape not found, please install it."
  exit 1
fi

output_dir="apps/extension/public/icon"
mkdir -p "$output_dir"

for size in 16 32 48 96 128; do
  inkscape --export-type=png \
    --export-width=$size \
    --export-height=$size \
    --export-filename="${output_dir}/${size}.png" \
    "apps/extension/public/logo.svg" || exit 1
done
