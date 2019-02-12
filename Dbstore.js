const fs = require('fs')
const async = require('async_hooks')
const Datastore = require('nedb')
const coder = require("./aescoder")

const DataType = {
    Folder: 0, // todo 文件夹支持
    Account: 1,
    Text: 2
}

const SCLevel = {
    Global: 0,
    Custom: 1 // todo 单独加密支持
}

class Record {
    constructor(type, parent, level, data) {
        this.type = type // 对应DataType
        this.parent = parent // todo 文件夹支持
        this.level = level // todo 单独加密 level0 全局加密 level1 使用单独加密
        this.data = data
        this.crt = new Date()
    }

    static newAccountRecord(data, parent = 0) {
        return new Record(DataType.Account, parent, SCLevel.Global, data)
    }
}

class Dbstore {

    constructor(username, password) {
        this.username = username
        this.password = password
        this.filepath = `${username}.cube`
        this.db = new Datastore({
            filename: this.filepath,
            afterSerialization: (data => {
                let en = coder.encrypt(this.password, data)
                return JSON.stringify(en)
            }),
            beforeDeserialization: (data => {
                let en = JSON.parse(data)
                return coder.decrypt(this.password, en.en, en.iv)
            })
        })
    }

    register(callback = err => { }) {
        if (fs.existsSync(this.filepath)) {
            callback('the data file exist')
        } else {
            this.db.loadDatabase()
            this.db.insert({
                _id: '0',
                owner: this.username
            }, (err, doc) => {
                if (doc) {
                    callback()
                }
            })
        }
    }

    login(callback = err => { }) {
        if (!fs.existsSync(this.filepath)) {
            return callback('username error')
        }
        this.db.loadDatabase((err) => {
            if (err != null) {
                callback('password error')
            } else {
                this.db.find({ _id: '0' }, (error, doc) => {
                    if (doc && doc.length > 0) {
                        callback()
                    } else {
                        callback('password error')
                    }
                })
                this.db.persistence.compactDatafile()
            }
        })
    }

    saveAccount(record, callback = (err, doc) => { }) {
        record.type = DataType.Account
        this.db.insert(record, callback)
    }

    findAccounts(condition = {}, callback = (err, docs) => { }) {
        condition.type = DataType.Account
        this.db.find(condition).sort({crt: 1}).exec(callback)
    }

    delRecord (id) {
        this.db.remove({_id: id})
    }

}

module.exports = { Dbstore, Record }

// const testDb = new Dbstore('test', 'test')
// testDb.register()
// testDb.login()