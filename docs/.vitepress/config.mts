import { defineConfig } from 'vitepress'

import { genSidebar } from './sidebar'

const sidebarEn = await genSidebar('docs')
const sidebarZh = await genSidebar('docs/zh', 'docs')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'HStreamDB Docs',
  titleTemplate: ':title | HStreamDB Docs',
  description: 'HStreamDB Documentation.',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  lastUpdated: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    sidebar: sidebarEn,

    socialLinks: [{ icon: 'github', link: 'https://github.com/hstreamdb/hstream' }],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: 'Chinese',
      lang: 'zh',
      title: 'HStreamDB 文档',
      titleTemplate: ':title | HStreamDB 文档',
      description: 'HStreamDB 文档。',
      themeConfig: {
        sidebar: sidebarZh,
      },
    },
  },
})
