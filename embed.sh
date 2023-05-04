#!/usr/bin/env bash

# Embed python snippets.
if [[ "$EMBED_ME_ARGS" == "" ]]; then
  ./include_snippets.py --snippets-root . --file-pattern "docs/**/write/*.md"
  ./include_snippets.py --snippets-root . --file-pattern "docs/**/receive/*.md"
fi
