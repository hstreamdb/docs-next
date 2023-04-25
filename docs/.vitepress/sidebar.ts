import { join } from 'path'
import { createReadStream, promises as fs } from 'fs'
import readline from 'readline'

const ignoredDirs = /^(?:\.vitepress|images|public|zh|_index\.md)/

/**
 * Returns the first line of the file.
 */
async function getFirstLine(file: string): Promise<string> {
  const readable = createReadStream(file)
  const reader = readline.createInterface({ input: readable })
  const line: string = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close()
      resolve(line)
    })
  })
  readable.close()
  return line
}

async function* getFiles(dir: string, rootDir = dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  const order = JSON.parse(await fs.readFile(join(dir, 'list.json'), 'utf8')).reduce((acc, cur, i) => {
    acc[cur] = i

    return acc
  }, {})

  for (const dirent of dirents) {
    const name = dirent.name

    if (ignoredDirs.test(name)) {
      continue
    }

    const res = join(dir, name)

    if (dirent.isDirectory()) {
      // Generate versioned sidebars.
      if (/^v[0-9\.]+/.test(name)) {
        yield {
          version: name,
          sidebar: getFiles(res, rootDir),
        }

        continue
      }

      const items: any[] = []

      for await (const f of getFiles(res, rootDir)) {
        if (f.link && f.link.endsWith('index.md')) continue

        items.push(f)
      }

      const title = await getFirstLine(join(res, '_index.md'))
      const hasIndex = await fs
        .access(join(res, 'index.md'), fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)

      yield {
        text: title,
        ...(hasIndex && { link: join(res.replace(rootDir, ''), 'index.md') }),
        items: items.sort((a, b) => a.order - b.order),
        collapsed: true,
        order: order[name],
      }
    } else if (dirent.isFile() && res.endsWith('.md')) {
      let title = (await getFirstLine(res)).replace('# ', '')

      if (title.startsWith('<!--')) {
        title = title.split(' ')[1]
      } else {
        title = title.replace('# ', '')
      }

      yield {
        text: title,
        link: res.replace(rootDir, ''),
        order: order[name],
      }
    }
  }
}

export async function genSidebarAndVersions(dir: string, rootDir = dir) {
  // '/' or '/zh'
  const relativeDir = join('/', dir.replace(rootDir, ''))

  const sidebar: any[] = []
  const versionedSidebars: Record<string, any[]> = {}

  for await (const f of getFiles(dir, rootDir)) {
    // If `f` has a `version` property, it means it's a versioned sidebar.
    if (f.version) {
      const versionSidebar: any[] = []

      for await (const ff of f.sidebar) {
        versionSidebar.push(ff)
      }

      versionedSidebars[join(relativeDir, f.version, '/')] = versionSidebar.sort((a, b) => a.order - b.order)
    } else {
      sidebar.push(f)
    }
  }

  return {
    sidebar: { '/': sidebar.sort((a, b) => a.order - b.order), ...versionedSidebars },
    versions: {
      text: 'Versions',
      items: [
        {
          text: 'Latest',
          link: join(relativeDir, '/'),
        },
        ...Object.keys(versionedSidebars).map((v) => ({
          text: v.replace(relativeDir, '').replace(/\//g, ''),
          link: v,
          activeMatch: v,
        })),
      ],
    },
  }
}
