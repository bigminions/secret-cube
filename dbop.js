exports.saveRecord = saveRecord

function saveRecord(record) {
    var sqlite3 = require('sqlite3').verbose()
    var db = new sqlite3.Database('temp')
    tryInit(db)

    var stmt = db.prepare('insert into record (data, type, parent, level) values (?, ?, ?, ?)')
    var result = stmt.run([record.data, record.type, record.parent, record.level])
    console.log('db op result = ' + result)
    stmt.finalize()
    db.close()
}

function tryInit (db) {
    db.exec('create table if not exists record (\
        id integer primary key autoincrement not null, \
        data text, \
        data_md5 text, \
        type integger, \
        parent integer, \
        level integer \
    )')
}