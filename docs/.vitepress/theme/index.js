import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import GitPod from './GitPod.vue'
import './custom.css'
import { usePickConsoleVersion, usePickExporterVersion, usePickVersion } from './pickVersion'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-top': () => h(GitPod),
    })
  },
  enhanceApp({ app }) {
    app.config.globalProperties.$version = usePickVersion
    app.config.globalProperties.$consoleVersion = usePickConsoleVersion
    app.config.globalProperties.$exporterVersion = usePickExporterVersion
  },
}
