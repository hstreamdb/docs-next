#!/usr/bin/env bash

if [[ $# -eq 0 ]]; then
  echo "You must provide a language code (such as en or zh) to switch to."
  exit 1
fi

LANG=$1

if [[ $LANG == "en" ]]; then
  echo "Switching to English..."

  mv ./docs/zh ./zh-backup
elif [[ $LANG == "zh" ]]; then
  echo "Switching to Chinese..."

  mv ./docs/zh ./zh-backup
  mv ./docs ./en-backup
  mv ./zh-backup ./docs
  mv ./en-backup/.vitepress ./docs
else
  echo "Invalid language code. Please use en or zh."
  exit 1
fi

LANG=$LANG npm run build

if [[ $LANG == "en" ]]; then
  mv ./zh-backup ./docs/zh
elif [[ $LANG == "zh" ]]; then
  mv ./docs ./zh-backup
  mv ./en-backup ./docs
  mv ./zh-backup/.vitepress ./docs
  mv ./zh-backup ./docs/zh
fi
