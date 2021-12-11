process.env.NODE_ENV = 'development'

import electron from 'electron'
import { spawn } from 'child_process'
import { createServer, build as viteBuild } from 'vite'
import chalk from 'chalk'
import { OutputPlugin } from 'rollup'
import waitOn from 'wait-on'
import { join, resolve } from 'path'

const __dirname = resolve()
const TAG = chalk.bgGreen(' dev.ts ')

/**
 * @param {{ name: string; configFile: string; writeBundle: import('rollup').OutputPlugin['writeBundle'] }} param0
 * @returns {import('rollup').RollupWatcher}
 */
export interface watcher {
  name: string,
  configFile: string,
  writeBundle: OutputPlugin['writeBundle']
}
function getWatcher({ name, configFile, writeBundle }: watcher) {
  return viteBuild({
    // Ensure `vite-main.config.ts` and `vite-preload.config.ts` correct `process.env.NODE_ENV`
    mode: process.env.NODE_ENV,
    // Options here precedence over configFile
    build: {
      watch: {},
    },
    configFile,
    plugins: [
      { name, writeBundle },
    ],
  })
}

/**
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchMain() {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess: any = null

  /**
   * @type {import('rollup').RollupWatcher}
   */
  const watcher = await getWatcher({
    name: 'electron-main-watcher',
    configFile: 'configs/vite-main.config.ts',
    writeBundle() {
      electronProcess && electronProcess.kill()
      electronProcess = spawn(electron as any, ['.'], {
        stdio: 'inherit',
        env: process.env,
      })
      waitOn({
        resources: [
          `tcp:127.0.0.1:${process.env.PORT}`,
          join(__dirname, 'dist/main/index.cjs'),
          join(__dirname, 'dist/preload/index.cjs')
        ],
      }).then(() => {
        console.groupEnd()
        console.clear()
        const server = chalk.bgBlueBright(' server ')
        const url = chalk.blueBright(`http://127.0.0.1:${process.env.PORT}`)
        console.group(server, `running in ${url}`)
        console.groupEnd()
      }).catch(err => {
        console.error(err)
      })
    },
  })

  return watcher
}

/**
 * @param {import('vite').ViteDevServer} viteDevServer
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchPreload(viteDevServer: any) {
  return getWatcher({
    name: 'electron-preload-watcher',
    configFile: 'configs/vite-preload.config.ts',
    writeBundle() {
      viteDevServer.ws.send({
        type: 'full-reload',
      })
    },
  })
}

// bootstrap
console.group(TAG, 'running dev')
const viteDevServer = await createServer({ configFile: 'configs/vite-renderer.config.ts' })

await viteDevServer.listen()
await watchPreload(viteDevServer)
await watchMain()
