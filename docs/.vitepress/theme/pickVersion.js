import { useData } from 'vitepress'

const versionMap = {
  'v0.16.0': {
    console: 'v1.0.0-beta6',
    exporter: 'v0.2.0',
  },
  'v0.17.0': {
    console: 'v1.0.0-beta6',
    exporter: 'v0.2.2',
  },
}

export function usePickVersion() {
  const { page } = useData()

  const matched = page.value.filePath.match(/v\d+\.\d+\.\d+/)

  if (matched) {
    return matched[0]
  } else {
    return 'latest'
  }
}

export function usePickConsoleVersion() {
  return versionMap[usePickVersion()]?.console || 'latest'
}

export function usePickExporterVersion() {
  return versionMap[usePickVersion()]?.exporter || 'latest'
}
