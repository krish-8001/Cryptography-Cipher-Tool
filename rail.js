
updateTexts();

function clearText() {
    document.getElementById("srctext").value = '';
    document.getElementById("resulttext").value = '';
}

function encrypt() {
    var src = document.getElementById("srctext").value;
    var rails = parseInt(document.getElementById("rails").value);
    var offset = parseInt(document.getElementById("offset").value);

    var result = '';
    for (var i = 0; i < rails; i++) {
        for (var j = 0; j < src.length; j++)
            if (railnumber(j, rails, offset) == i)
                result += src[j];
    }

    document.getElementById("resulttext").value = result;
    updateLayout(src);
}

function decrypt() {
    var src = document.getElementById("srctext").value;
    var rails = parseInt(document.getElementById("rails").value);
    var offset = parseInt(document.getElementById("offset").value);

    var result = new Array(src.length);
    var k = 0;
    for (var i = 0; i < rails; i++) {
        for (var j = 0; j < src.length; j++)
            if (railnumber(j, rails, offset) == i)
                result[j] = src[k++];
    }

    document.getElementById("resulttext").value = result.join("");
    updateLayout(result.join(""));
}

function railnumber(pos, rails, offset) {
    pos = (pos + offset) % (rails * 2 - 2);
    if (pos < rails)
        return pos;
    else
        return 2 * rails - pos - 2;
}

function updateLayout(src) {
    var rails = parseInt(document.getElementById("rails").value);
    var offset = parseInt(document.getElementById("offset").value);

    var result = '';
    for (var i = 0; i < rails; i++) {
        for (var j = 0; j < src.length; j++)
            if (railnumber(j, rails, offset) == i)
                result += src[j];
            else
                result += ' ';
        result += '<br/>';
    }

    document.getElementById("layout").innerHTML = result;
}

function updateTexts() {
    if (document.getElementById("encryptbtn").checked)
        encrypt();
    else
        decrypt();
}
