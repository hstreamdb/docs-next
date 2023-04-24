import { defineConfig } from 'vitepress'

import { genSidebar } from './sidebar'

const sidebarEn = await genSidebar('docs')
const sidebarZh = await genSidebar('docs/zh', 'docs')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'HStream Docs',
  titleTemplate: ':title | HStream Docs',
  description: 'HStream Documentation.',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  lastUpdated: true,
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    sidebar: sidebarEn,

    nav: [
      {
        text: 'hstream.io',
        link: 'https://hstream.io/',
      },
      {
        text: 'Latest',
        items: [{ text: 'Release Notes', link: '/release-notes' }],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/hstreamdb/hstream' }],
    editLink: {
      pattern: 'https://github.com/hstreamdb/docs-next/edit/main/docs/:path',
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: 'Chinese',
      lang: 'zh',
      title: 'HStream 文档',
      titleTemplate: ':title | HStream 文档',
      description: 'HStream 文档。',
      themeConfig: {
        sidebar: sidebarZh,

        nav: [
          {
            text: 'hstream.io',
            link: 'https://hstream.io/',
          },
          {
            text: 'Latest',
            items: [{ text: '发布说明', link: '/zh/release-notes' }],
          },
        ],
      },
    },
  },
})
