const { app, BrowserWindow, ipcMain } = require('electron')
const { Nuxt, Builder} = require('nuxt')
const express = require('express')
const clientConfig = require('./config/client.js')

const isDevMode = process.env.NODE_ENV == 'development'
clientConfig.dev = isDevMode
clientConfig.rootDir = __dirname


app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        CreateWindow()
    }
})

ipcMain.handle('test-action', (event, ...params) => {
    console.log(event, params)
})

const StartServer = async () => {
    console.log('starting nuxt server')
    const nuxt = new Nuxt(clientConfig)
    
    if(isDevMode){
        const builder = new Builder(nuxt)
        await builder.build()    
    }

    const expressApp = express()
    expressApp.use(nuxt.render)

    expressApp.listen(clientConfig.server.port, () => {
        StartElectron()
    })
}

const StartElectron = async () => {
    console.log('starting electron')
    if(!app.isReady()) await app.whenReady()

    CreateWindow()
}

const CreateWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            defaultEncoding: 'utf-8'
        }
    })

    win.loadURL('http://localhost:3000')
}


StartServer()

if(isDevMode){
    try {
        require('electron-reloader')(module, {
            debug: true,
            watchRenderer: false
        })
    }catch(err){ console.log(err) }
}