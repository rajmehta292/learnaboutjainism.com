#!/usr/bin/env bash
set -euo pipefail
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/full_texts"
mkdir -p "$OUT_DIR"

echo 'Downloading Jaina Sutras, Part I...'
curl -L --fail --retry 3 'https://upload.wikimedia.org/wikipedia/commons/c/c8/The_sacred_books_of_the_East_%28IA_1922707.0022.001.umich.edu%29.pdf' -o "$OUT_DIR/Jaina_Sutras_Part_I_SBE_22.pdf"

echo 'Downloading Jaina Sutras, Part II...'
curl -L --fail --retry 3 'https://upload.wikimedia.org/wikipedia/commons/d/d4/The_sacred_books_of_the_East_%28IA_1922707.0045.002.umich.edu%29.pdf' -o "$OUT_DIR/Jaina_Sutras_Part_II_SBE_45.pdf"

echo 'Downloading Gommatasara Jiva-kanda...'
curl -L --fail --retry 3 'https://upload.wikimedia.org/wikipedia/commons/8/87/Gommatsara_Jiva-Kand.pdf' -o "$OUT_DIR/Gommatasara_Jiva_Kanda_1927.pdf"

echo 'Downloading Gommatasara Karma-kanda...'
curl -L --fail --retry 3 'https://archive.org/download/gommatsarakarmak0000deve/gommatsarakarmak0000deve.pdf' -o "$OUT_DIR/Gommatasara_Karma_Kanda_1927.pdf"

echo 'Downloads complete. Review source and rights metadata before redistribution.'