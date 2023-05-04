import { useData } from 'vitepress'

export function usePickVersion() {
  const { page } = useData()

  const matched = page.value.filePath.match(/v\d+\.\d+\.\d+/)

  if (matched) {
    return matched[0]
  } else {
    return 'latest'
  }
}
