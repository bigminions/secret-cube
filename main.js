const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron')
const path = require('path')
const aescoder = require('./aescoder')
const {Dbstore, Record} = require('./Dbstore')

let win

function main() {
    win = new BrowserWindow({
        width: 950,
        height: 850,
        show: false,
        autoHideMenuBar: true,
        // frame: false, todo 设置无边框 参考https://blog.csdn.net/toubennuhai/article/details/53039612
    })

    win.loadFile(path.join('renderer', 'login.html'))

    win.on('ready-to-show', () => {
        win.show()
    })

    win.on('closed', () => {
        win = null
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
}

function loadIndexPage() {
    win.webContents.loadFile((path.join('renderer', 'index.html')))
    win.webContents.on('dom-ready', () => {
        loadpage(1)
    })
}

function loadpage (page) {
    dbStore.findAccounts({}, (err, docs) => {
        if (err) {
            wintip('can not init data')
        } else {
            let maxpage = Math.ceil(docs.length / 9)
            if (page < 1) {
                page = 1
            }
            if (page > maxpage) {
                page = maxpage
            }
            docs = docs.slice((page - 1) * 9, page * 9)
            win.webContents.send('accounts', docs, {currpage: page, maxpage: maxpage})
        }
    })
}

function wintip (msg) {
    win.webContents.send('comm-err', msg)
}

let mainMenuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'Add Item',
            click() {
                createAddWindow()
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit()
            }
        }
    ]
}]

if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

let dbStore
ipcMain.on('login', (event, data) => {
    dbStore = new Dbstore(data.username, data.password)
    dbStore.login(err => {
        if (err != null) {
            wintip('username or passowrd error')
        } else {
            loadIndexPage()
        }
    })
})

ipcMain.on('register', (event, data) => {
    dbStore = new Dbstore(data.username, data.password)
    dbStore.register((err) => {
        if (err != null) {  
            wintip(err)
        } else {
            loadIndexPage()
        }
    })
})

ipcMain.on('account:add', (event, data) => {
    let record = Record.newAccountRecord(data)
    dbStore.saveAccount(record, (err, doc) => {
        if (err) {
            wintip('save error')
        } else {
            loadpage(100000000) // 刷新最后一页
        }
    })
})

ipcMain.on('record:del', (event, id) => {
    dbStore.delRecord(id)
    console.log('del record succ ' + id)
    win.webContents.send('record:del_succ', id)
})

ipcMain.on('loadpage', (event, page) => {
    loadpage(page)
})

app.on('ready', main)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        main()
    }
})