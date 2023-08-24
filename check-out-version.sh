#!/usr/bin/env bash

set -euo pipefail

VERSION=""
FORCE=false
REMOVE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      VERSION=$2
      shift
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --remove)
      REMOVE=true
      shift
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  echo "You must use --version (such as --version v0.15.0) to provide a version for checkout."
  exit 1
fi

if [[ "$REMOVE" == "true" ]]; then
  rm -rf "docs/$VERSION"
  rm -rf "docs/zh/$VERSION"
  exit 0
fi

if [[ -d "docs/$VERSION" ]]; then
  if [[ "$FORCE" == "true" ]]; then
    rm -rf "docs/$VERSION"
    rm -rf "docs/zh/$VERSION"
  else
    echo "docs $VERSION already exists. Use --force to overwrite it."
    exit 1
  fi
fi

cp -r docs docs-$VERSION
rm -rf docs-$VERSION/.vitepress
rm -rf docs-$VERSION/public
rm -rf docs-$VERSION/v*
rm -rf docs-$VERSION/zh/v*

# Move zh docs first.
mv "docs-$VERSION/zh" "docs/zh/$VERSION"
mv "docs-$VERSION" "docs/$VERSION"
