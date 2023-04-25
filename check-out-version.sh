#!/usr/bin/env bash

set -euo pipefail

VERSION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      VERSION=$2
      shift
      shift
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  echo "You must use --version (such as --version v0.15.0) to provide a version for checkout."
  exit 1
fi

cp -r docs docs-$VERSION
rm -rf docs-$VERSION/.vitepress
mv docs-$VERSION/zh docs-zh-$VERSION
mv docs-$VERSION docs/$VERSION
mv docs-zh-$VERSION docs/zh/$VERSION
