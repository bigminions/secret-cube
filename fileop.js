exports.saveRecord = saveRecord

function saveRecord(record) {
    var content = JSON.stringify(record)
    var fs = require('fs')
    fs.writeFile('record.sc', content, (err) => {
        if (err) {
            console.log("can't not save record " + content)
        }
    })
}