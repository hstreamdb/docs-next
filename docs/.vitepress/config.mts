import { defineConfig } from 'vitepress'

import { genSidebarAndVersions } from './sidebar'

const { sidebar: sidebarEn, versions: versionsEn } = await genSidebarAndVersions('docs')
const { sidebar: sidebarZh, versions: versionsZh } = await genSidebarAndVersions('docs/zh', 'docs')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'HStream Docs',
  titleTemplate: ':title | HStream Docs',
  description: 'HStream Documentation.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'script',
      {
        defer: 'defer',
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        'data-cf-beacon': '{"token": "bbd21181c54745aabcb72e188c333ccc"}',
      },
    ],
  ],
  lastUpdated: true,
  ignoreDeadLinks: false,
  srcExclude: ['**/_index.md'],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    sidebar: sidebarEn,

    nav: [
      {
        text: 'hstream.io',
        link: 'https://hstream.io/',
      },
      versionsEn,
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
          versionsZh,
        ],
      },
    },
  },
})
