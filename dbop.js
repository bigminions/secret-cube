exports.saveRecord = saveRecord

function saveRecord(record, callback = (err, doc) => {}) {
    var Datastore = require('nedb')
    db = new Datastore({ filename: './data.cube', autoload: true })
    db.insert(record, (err, newDoc) => {
        callback(err, newDoc)
    })
}