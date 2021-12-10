process.env.NODE_ENV = 'production'

import { build as viteBuild } from 'vite'
import { build as electronBuild } from 'electron-builder'
import chalk from 'chalk'
// 读取打包配置文件
import { Configuration } from 'electron-builder'
import { readFileSync } from 'fs'
import { join } from 'path'
const config = JSON.parse(readFileSync(join(process.cwd(), 'configs/electron-builder.config.json'), 'utf8'))

const TAG = chalk.bgBlue(' build.ts ')

const viteConfigs = {
  main: 'configs/vite-main.config.ts',
  preload: 'configs/vite-preload.config.ts',
  reactTs: 'configs/vite-renderer.config.ts',
}

async function buildElectron() {
  for (const [name, configPath] of Object.entries(viteConfigs)) {
    console.group(TAG, name)
    await viteBuild({ configFile: configPath, mode: process.env.NODE_ENV })
    console.groupEnd()
    console.log() // for beautiful log.
  }
}

async function packElectron() {
  return electronBuild({
    config: config as Configuration,
    // if you want to build windows platform
    // targets: Platform.WINDOWS.createTarget(),
  }).then(result => {
    console.log(TAG, 'files:', chalk.green(result))
  })
}

// bootstrap
await buildElectron()
await packElectron()
