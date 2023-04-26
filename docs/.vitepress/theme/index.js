import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import GitPod from './GitPod.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-top': () => h(GitPod),
    })
  },
}
