const { app, BrowserWindow, ipcMain } = require('electron')
const { Nuxt, Builder} = require('nuxt')
const axios = require('axios')
const express = require('express')
const { openStreamDeck } = require('elgato-stream-deck')
const Sleep = require('./utils/Sleep.js')

// const sharp = require('sharp')

const clientConfig = require('./config/client.js')

const isDevMode = process.env.NODE_ENV == 'development'
clientConfig.dev = isDevMode
clientConfig.rootDir = __dirname

const myStreamDeck = openStreamDeck()
const dimension = myStreamDeck.deviceProperties.ICON_SIZE

let renderer = null

// console.log(myStreamDeck)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        CreateWindow()
    }
})

class Button {
    constructor(data){
        this.id = data.id
        this.settings = data.settings

        ipcMain.handle(`button.settings.update.${ this.id }`, (event, data) => {
            this.id = data.id
            this.settings = data.settings
        })

        ipcMain.handle(`button.image.update.${ this.id }`, (event, data) => {
            myStreamDeck.fillImage(this.id, Buffer.from(data))
        })

        this.Start()
    }

    async Start(){
        while(true){
            if(this.settings.baseUrl !== '' && this.settings.active){
                let healthData = null

                try {
                    let response = await axios.get(this.settings.baseUrl)
                    healthData = response.data
                }catch(err){
                    healthData = { error: true }
                }

                renderer.send(`button.data.update.${ this.id }`, healthData)
            }

            await Sleep(Math.max(1000, this.settings.updateInterval))
        }
    }
}

const deckButtons = []

ipcMain.handle('renderer.ready', (event, buttons) => {
    renderer = event.sender
    for(let i = 0; i < buttons.length; i++){
        deckButtons.push(new Button(buttons[i]))
    }
})

// let imageData = []

// for(let y = 0; y < 72; y++){
//     for(let x = 0; x < 72; x++){
//         imageData.push(255,0,0)
//     }
// }

// imageData = Buffer.from(imageData)

// // let imageData = Buffer.from()

// const Sleep = async (time) => {
//     return new Promise((resolve) => {
//         setTimeout(() => { resolve() }, time)
//     })
// }

// ipcMain.handle('test-action', async (event, ...params) => {
//     if(button == true) return 

//     // console.log(event, params)
//     button = true

//     while(true){
//         imageData = []

//         for(let y = 0; y < 72; y++){
//             for(let x = 0; x < 72; x++){
//                 imageData.push(Math.floor(Math.random() * 255),0,0)
//             }
//         }

//         imageData = Buffer.from(imageData)

//         myStreamDeck.fillImage(0, imageData)
        
//         await Sleep(1000 / 40)
//     }

//     imageData = []

//     for(let y = 0; y < 72; y++){
//         for(let x = 0; x < 72; x++){
//             imageData.push(Math.floor(Math.random() * 255),0,0)
//         }
//     }

//     imageData = Buffer.from(imageData)

//     // if(button) myStreamDeck.fillColor(0, 255, 0, 0)
//     if(button) myStreamDeck.fillImage(0, imageData)
//     else myStreamDeck.fillColor(0, 0, 0, 0)
// })

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

// if(isDevMode){
//     try {
//         require('electron-reloader')(module, {
//             debug: true,
//             watchRenderer: false
//         })
//     }catch(err){ console.log(err) }
// }