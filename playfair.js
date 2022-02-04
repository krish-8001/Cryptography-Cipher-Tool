
updateTexts();

function clearText() {
    document.getElementById("srctext").value = '';
    document.getElementById("resulttext").value = '';
}

function encrypt() {
    var src = document.getElementById("srctext").value;
    var padcharacter = document.getElementById("padcharacter").value;
    var paddouble = document.getElementById("paddouble").value == "yes" ? true : false;
    var table = getKey();
    var letters = getAlphabet();

    var dst = preprocessText(src).split('');

    var i = 0;
    while (i < dst.length) {
        if (letters.indexOf(dst[i].toUpperCase()) != -1) {
            var j = i + 1;
            while (j < dst.length) {
                if (letters.indexOf(dst[j].toUpperCase()) != -1) {
                    if (dst[i].toUpperCase() == dst[j].toUpperCase() && paddouble) {
                        dst.splice(j, 0, padcharacter);
                    }

                    digram = encryptDigram(dst[i] + dst[j], table);
                    dst[i] = digram[0];
                    dst[j] = digram[1];
                    break;
                }
                j++;
            }
            if (j >= dst.length) {
                digram = encryptDigram(dst[i] + padcharacter, table);
                dst[i] = digram[0];
                dst.push(digram[1]);
            }
            i = j + 1;
        }
        else {
            i++;
        }
    }

    document.getElementById("resulttext").value = dst.join('');
}

function decrypt() {
    var src = document.getElementById("srctext").value;
    var dst = preprocessText(src).split('');
    var table = getKey();
    var letters = getAlphabet();

    var i = 0;
    while (i < dst.length) {
        if (letters.indexOf(dst[i].toUpperCase()) != -1) {
            var j = i + 1;
            while (j < dst.length) {
                if (letters.indexOf(dst[j].toUpperCase()) != -1) {
                    digram = decryptDigram(dst[i] + dst[j], table);
                    dst[i] = digram[0];
                    dst[j] = digram[1];
                    break;
                }
                j++;
            }
            i = j + 1;
        }
        else {
            i++;
        }
    }
    document.getElementById("resulttext").value = dst.join('');
}

function findLetterPosition(ch, table) {
    for (var i = 0; i < 5; i++)
        for (var j = 0; j < 5; j++)
            if (ch.toUpperCase() == table[i][j])
                return { row: i, col: j };
    return null;
}

function encryptDigram(text, table) {
    var pos1 = findLetterPosition(text[0], table);
    var pos2 = findLetterPosition(text[1], table);
    var ch1 = '';
    var ch2 = '';

    if (pos1.row == pos2.row && pos1.col == pos2.col) {
        ch1 = table[(pos1.row + 1) % 5][(pos1.col + 1) % 5];
        ch2 = table[(pos2.row + 1) % 5][(pos2.col + 1) % 5];
    }
    else if (pos1.row == pos2.row) {
        ch1 = table[pos1.row][(pos1.col + 1) % 5];
        ch2 = table[pos2.row][(pos2.col + 1) % 5];
    }
    else if (pos1.col == pos2.col) {
        ch1 = table[(pos1.row + 1) % 5][pos1.col];
        ch2 = table[(pos2.row + 1) % 5][pos2.col];
    }
    else {
        ch1 = table[pos1.row][pos2.col];
        ch2 = table[pos2.row][pos1.col];
    }

    if (text[0] >= 'a')
        ch1 = ch1.toLowerCase();
    if (text[1] >= 'a')
        ch2 = ch2.toLowerCase();
    return ch1 + ch2;
}

function decryptDigram(text, table) {
    var pos1 = findLetterPosition(text[0], table);
    var pos2 = findLetterPosition(text[1], table);
    var ch1 = '';
    var ch2 = '';

    if (pos1.row == pos2.row && pos1.col == pos2.col) {
        ch1 = table[(pos1.row + 4) % 5][(pos1.col + 4) % 5];
        ch2 = table[(pos2.row + 4) % 5][(pos2.col + 4) % 5];
    }
    else if (pos1.row == pos2.row) {
        ch1 = table[pos1.row][(pos1.col + 4) % 5];
        ch2 = table[pos2.row][(pos2.col + 4) % 5];
    }
    else if (pos1.col == pos2.col) {
        ch1 = table[(pos1.row + 4) % 5][pos1.col];
        ch2 = table[(pos2.row + 4) % 5][pos2.col];
    }
    else {
        ch1 = table[pos1.row][pos2.col];
        ch2 = table[pos2.row][pos1.col];
    }

    if (text[0] >= 'a')
        ch1 = ch1.toLowerCase();
    if (text[1] >= 'a')
        ch2 = ch2.toLowerCase();
    return ch1 + ch2;
}

function getKey() {
    var encryptionkey = document.getElementById("encryptionkey").value.toUpperCase();
    var translatefrom = document.getElementById("translatefrom").value;
    var letters = getAlphabet();
    var key = '';

    for (var i = 0; i < encryptionkey.length; i++) {
        if (encryptionkey[i] < 'A' || encryptionkey[i] > 'Z')
            continue;
        if (key.indexOf(encryptionkey[i]) == -1 && encryptionkey[i] != translatefrom)
            key += encryptionkey[i];
    }

    for (var i = 0; i < letters.length; i++) {
        if (key.indexOf(letters[i]) == -1 && letters[i] != translatefrom)
            key += letters[i];
    }

    var table = [key.substring(0, 5), key.substring(5, 10), key.substring(10, 15), key.substring(15, 20), key.substring(20, 25)];

    return table;
}

function getAlphabet() {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
}

function preprocessText(src) {
    var translatefrom = document.getElementById("translatefrom").value;
    var translateto = document.getElementById("translateto").value;
    var dst = '';

    src = src.toUpperCase();

    for (var i = 0; i < src.length; i++) {
        if (src[i] == translatefrom)
            dst += translateto;
        else
            dst += src[i];
    }

    return dst;
}

function updateKey() {
    var table = getKey();
    document.getElementById("translationtable").innerHTML = table[0] + '<br/>' + table[1] + '<br/>' + table[2] + '<br/>' + table[3] + '<br/>' + table[4];
}

function updateTexts() {
    if (document.getElementById("encryptbtn").checked)
        encrypt();
    else
        decrypt();
    updateKey();
}
