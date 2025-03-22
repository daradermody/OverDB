import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

const isProd = process.env.NODE_ENV === 'production'

export const dataDir = isProd ? '/var/lib/overdb' : path.resolve(__dirname, '../../data')

export function setupDataDir() {
  if (isProd) {
    if (os.platform() !== 'linux') {
      throw new Error('Only Linux is supported to run in production')
    }
    fs.mkdirSync(dataDir, {recursive: true})
  }
}

