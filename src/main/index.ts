import os from 'os'
import { join } from 'path'
import { app, BrowserWindow, session } from 'electron'
// https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function bootstrap() {
  win = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
  })

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    //install vue devtool
    try {
      console.log(process.platform)
      let devpath: string = ''
      switch (process.platform) {
        case 'darwin': // mac
          devpath = '/Library/Application Support/Google/Chrome/Default/Extensions'
          break
        case 'win32': // windows
          devpath = '%LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions'
          break
        case 'linux':
          devpath = '/.config/google-chrome/Default/Extensions'
          break
      }
      devpath += '/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.20_0';
      console.log(join(os.homedir(), devpath))
      await session.defaultSession.loadExtension(join(os.homedir(), devpath));
    } catch (e) {
      console.error('Vue Devtools failed to install:', e);
    }
    const url = `http://127.0.0.1:${process.env['PORT']}`
    win.loadURL(url)
    win.maximize()
    win.webContents.openDevTools()
  }
}

app.whenReady().then(bootstrap)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

// @TODO
// auto update
/* if (app.isPackaged) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) =>
      // maybe you need to record some log files.
      console.error('Failed check update:', e)
    )
} */
