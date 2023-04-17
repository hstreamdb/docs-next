import { defineConfig } from 'vitepress'

import { genSidebar } from './sidebar'

const sidebarEn = await genSidebar('docs')
// genSidebar('./docs/zh')

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
        sidebar: [
          {
            text: '概述',
            link: '/zh/introduction/overview',
          },
          {
            text: '快速开始',
            link: '/zh/start/quickstart-with-docker',
          },
          {
            text: '概念',
            link: '/zh/concepts',
          },
          {
            text: '用户指南',
            items: [
              {
                text: 'Write Records to Streams',
                link: '/zh/guides/write',
              },
              {
                text: 'Consume Records with Subscriptions',
                link: '/zh/guides/consume',
              },
              {
                text: 'Create and Manage Streams',
                link: '/zh/guides/stream',
              },
              {
                text: 'Create and Manage Subscriptions',
                link: '/zh/guides/subscription',
              },
              {
                text: 'Manage Shards of the Stream',
                link: '/zh/guides/shards',
              },
              {
                text: 'Get Records from Shards of the Stream with Reader',
                link: '/zh/guides/reader',
              },
              {
                text: 'Get Records from Shards of the Stream with Subscription',
                link: '/zh/guides/sql',
              },
            ],
            collapsed: true,
          },
        ],
      },
    },
  },
})
