const dict = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 
    'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z', 
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', 
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '='
]

const RandomLevel = {
    ONLY_NUMBER: 0,
    ONLY_UPPER: 1,
    UPPER_AND_LOWER: 2,
    NUMBER_AND_LETTER: 3,
    ALL: 4
}

function generateRandomText(len = 8, rlevel = RandomLevel.NUMBER_AND_LETTER) {
    let text = ''
    let point = 0
    let range = 10
    if (rlevel == RandomLevel.ONLY_UPPER) {
        point = 10
        range = 26
    } else if (rlevel == RandomLevel.UPPER_AND_LOWER) {
        point = 10
        range = 26 + 26
    } else if (rlevel == RandomLevel.NUMBER_AND_LETTER) {
        point = 0
        range = 10 + 26 + 26
    } else if (rlevel == RandomLevel.ALL) {
        point = 0
        range = dict.length
    }
    for (let i = 0; i < len; i++) {
        text += dict[point + Math.floor(Math.random() * range)]
    }
    return text
}

// strength 取值 0 - 99
function generate (strength) {
    var len = 6 + Math.floor(strength / 5)
    var level = Math.floor(strength / 20)
    return generateRandomText(len, level)
}

module.exports = {generate}

// console.log(generateRandomText(12, RandomLevel.NUMBER_AND_LETTER))
// console.log(generateRandomText(12, RandomLevel.ONLY_NUMBER))
// console.log(generateRandomText(12, RandomLevel.ONLY_UPPER))
// console.log(generateRandomText(12, RandomLevel.UPPER_AND_LOWER))
// console.log(generateRandomText(12, RandomLevel.ALL))

// for (let i = 0; i < 100; i++) {
//     console.log(i + ' : ' + generate(i))
// }