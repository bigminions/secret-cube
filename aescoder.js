// https://www.npmjs.com/package/aes-js

const aesjs = require("aes-js")

exports.encrypt = encrypt
exports.decrypt = decrypt

function encrypt(passpharse, text) {
    if (!passpharse) {
        throw "passpharse should not be empyt"
    }

    var textArray = aesjs.utils.utf8.toBytes(text)
    textArray =  aesjs.padding.pkcs7.pad(textArray)
    var key = aesjs.utils.utf8.toBytes(passpharse)
    key = trySplitBytesToSpecialLength(32, key)
    iv = generateIv()
    
    var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
    var encryptedBytes = aesCbc.encrypt(textArray)

    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
    var ivHex = aesjs.utils.hex.fromBytes(iv)
    return {
        iv : ivHex,
        en : encryptedHex
    }
}

function decrypt (passpharse, ciphertext , ivHex) {
    if (!passpharse) {
        throw "passpharse should not be empyt"
    }
    var iv = aesjs.utils.hex.toBytes(ivHex)
    var ciphertextArray = aesjs.utils.hex.toBytes(ciphertext)
    var key = aesjs.utils.utf8.toBytes(passpharse)
    key = trySplitBytesToSpecialLength(32, key)

    var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
    var decryptedBytes = aesCbc.decrypt(ciphertextArray)
    var textArray = aesjs.padding.pkcs7.strip(decryptedBytes)
    return aesjs.utils.utf8.fromBytes(textArray)
}

function generateIv () {
    var iv = []
    for (var i = 0; i < 16; i++) {
        iv.push(Math.floor(Math.random() * 256))
    }
    var ivArray = new Uint8Array(iv)
    return iv
}

function trySplitBytesToSpecialLength(specialLength, bytes) {
    var result = new Uint8Array(specialLength)
    result.set(bytes, 0)
    return result
}

// var enTextAndIv = encrypt("password", "hello, 中文")
// console.log(enTextAndIv)
// var text = decrypt("password", enTextAndIv.en, enTextAndIv.iv)
// console.log(text)