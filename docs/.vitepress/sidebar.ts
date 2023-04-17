import { join } from 'path'
import { createReadStream, promises as fs } from 'fs'
import readline from 'readline'

const ignoredDirs = ['.vitepress', 'images', 'public', 'zh', '_index.md']

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
  const order = JSON.parse(await fs.readFile(join(dir, 'list.json'), 'utf8'))

  for (const dirent of dirents) {
    const name = dirent.name

    if (ignoredDirs.includes(name)) continue

    const res = join(dir, name)

    if (dirent.isDirectory()) {
      const items: any[] = []

      for await (const f of getFiles(res, rootDir)) {
        items.push(f)
      }

      const title = await getFirstLine(join(res, '/_index.md'))

      yield {
        text: title,
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

export async function genSidebar(dir: string) {
  const sidebar: any[] = []

  for await (const f of getFiles(dir)) {
    sidebar.push(f)
  }

  return sidebar.sort((a, b) => a.order - b.order)
}
