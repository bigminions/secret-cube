const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const aescoder = require('./aescoder')
const dbop = require('./dbop')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
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

let addWindow
function createAddWindow () {
  addWindow = new BrowserWindow({})
  addWindow.loadFile('addWindow.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

if (process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
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

ipcMain.on('account:add', function(e, data) {
  console.log(data)
  data.account = aescoder.encrypt(data.passpharse, data.account)
  data.password = aescoder.encrypt(data.passpharse, data.password)

  console.log(data)

  // todo save data to sqlite3
  var record = {
    data: data,
    type: 1,
    parent: 0,
    level: 1
  }
  dbop.saveRecord(record)


  win.webContents.send('acount:add', data)
})