#!/usr/bin/env bash

while [[ $# -gt 0 ]]; do
  case $1 in
    --verify)
      EMBED_ME_ARGS=--verify
      shift
      ;;
  esac
done

mkdir tmp
cp $PWD/examples/java/app/src/main/java/docs/code/examples/* $PWD/tmp/
cp $PWD/examples/go/examples/* $PWD/tmp/

npx embedme --source-root $PWD/assets docs/quickstart-with-docker.md $EMBED_ME_ARGS
npx embedme --source-root $PWD/tmp docs/guides/*.md $EMBED_ME_ARGS

# Embed python snippets.
if [[ "$EMBED_ME_ARGS" != "--verify" ]]; then
  ./include_snippets.py --snippets-root . --file-pattern "docs/guides/*.md"
fi

rm -rf tmp
