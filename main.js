const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow


let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600})

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        console.log('start download')

        setTimeout(() => {
            console.log('trigger cancel')
            item.cancel()
        }, 100)

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.on('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })
    mainWindow.webContents.downloadURL('https://github.com');
}

app.on('ready', createWindow)
