<script setup>
import { useData } from 'vitepress'

const { theme, page } = useData()
</script>

<template>
  <a
    :style="{
      display: 'block',
      marginBottom: '1rem',
    }"
    :href="`https://gitpod.io/#${theme.editLink.pattern.replace(':path', page.filePath)}`"
    target="_blank"
    rel="noreferrer noopener"
  >
    <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" />
  </a>
</template>
