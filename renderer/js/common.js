const electron = nodeRequire('electron')
const { ipcRenderer } = electron

ipcRenderer.on('comm-err', (event, msg) => {
    alert(msg)
})