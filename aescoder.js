// https://www.npmjs.com/package/aes-js

var aesjs = require("aes-js")

exports.encrypt = encrypt
exports.decrypt = decrypt

function encrypt(passpharse, text) {
    if (!passpharse) {
        throw "passpharse should not be empyt"
    }

    var textArray = textToI6Bytes(text)
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
    return I6BytesToText(decryptedBytes)
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

// text fix to 16 bytes times
function textToI6Bytes (text) {
    var textArray = aesjs.utils.utf8.toBytes(text)
    // 设置头2位为长度位，最长支持65535个字母
    // add length to head, it take two byte, so it can handle max length 65535 bytes
    if (textArray.length > 65535) {
        throw "text length is too long, must <= 65535"
    }
    var lengthArray = new Uint8Array([textArray.length >> 8, textArray.length & 255])
    var textWithLength = new Uint8Array(textArray.length + 2)
    textWithLength.set(lengthArray, 0)
    textWithLength.set(textArray, 2)
    
    var needfix = 16 - textWithLength.length % 16
    needfix = needfix == 16 ? 0 : needfix;
    return trySplitBytesToSpecialLength(textWithLength.length + needfix, textWithLength)
}

// 16 bytes reset to stand text
function I6BytesToText (bytes) {
    var textLen = (bytes[0] << 8) + bytes[1]
    var textArray = bytes.slice(2, textLen + 2)
    return aesjs.utils.utf8.fromBytes(textArray)
}


// var bytes = textToI6Bytes("hello, 中文_")
// console.log("textToI6Bytes - " + bytes)
// var text = I6BytesToText(bytes)
// console.log("I6BytesToText - " + text)

// var enTextAndIv = encrypt("password", "hello, 中文")
// console.log(enTextAndIv)
// var text = decrypt("password", enTextAndIv['text'], enTextAndIv['iv'])
// console.log(text)