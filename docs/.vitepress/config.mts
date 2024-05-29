import { defineConfig } from 'vitepress'

import { genSidebarAndVersions } from './sidebar'

const lang = process.env.LANG

const { sidebar, versions } = await genSidebarAndVersions('docs')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'HStream Docs',
  titleTemplate: ':title | HStream Docs',
  description: 'HStream Documentation.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    // TODO: remove below analytics code
    // [
    //   'script',
    //   {
    //     defer: 'defer',
    //     src: 'https://static.cloudflareinsights.com/beacon.min.js',
    //     'data-cf-beacon': '{"token": "bbd21181c54745aabcb72e188c333ccc"}',
    //   },
    // ],
  ],
  lastUpdated: true,
  ignoreDeadLinks: 'localhostLinks',
  srcExclude: ['**/_index.md'],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    sidebar: sidebar,

    nav: [
      {
        text: 'hstream.io',
        link: 'https://hstream.io/',
      },
      versions,
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
      ...((lang === undefined || lang === 'en') && { label: 'English', lang: 'en' }),
      ...(lang === 'zh' && {
        label: 'Chinese',
        lang: 'zh',
        title: 'HStream 文档',
        titleTemplate: ':title | HStream 文档',
        description: 'HStream 文档。',
      }),
    },
  },
})
