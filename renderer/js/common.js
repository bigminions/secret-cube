const electron = nodeRequire('electron')
const { ipcRenderer } = electron

ipcRenderer.on('comm-err', (event, msg) => {
    M.toast({
        html: msg,
        displayLength: 1000,
    })
})