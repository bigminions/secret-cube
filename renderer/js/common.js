String.prototype.dbLength = function() {
    var str = this,leg=str.length;
    for (var i in str) {
        if (str.hasOwnProperty(i)) {
            var db = str[i].charCodeAt(0).toString(16).length == 4;
            if (db) leg += 1;
        }
    }
    return leg;
}

const electron = nodeRequire('electron')
const { ipcRenderer, clipboard } = electron

ipcRenderer.on('comm-err', (event, msg) => {
    tip(msg)
})

function tip (msg) {
    M.toast({
        html: msg,
        displayLength: 1000,
    })
}