//Measurement mouse tooltip

$(document).ready(function () {


    document.body.onmousemove = moveCursor;
    var curTxt = document.createElement('div');
    curTxt.id = "cursorText";
    /* Or whatever you want */
    document.body.appendChild(curTxt);
    var curTxtLen = [30, 30];

    function moveCursor(e) {
        if (!e) {
            e = window.event;
        }
        curTxt.style.left = e.clientX - curTxtLen[0] + 'px';
        curTxt.style.top = e.clientY - curTxtLen[1] + 'px';
        curTxt.innerHTML = '';
    }


        document.addEventListener("tailFired", function (e) {

        var tailLength = e.detail.tailLength;
        curTxt.innerHTML = (tailLength.toFixed(2) + " mm");
    });


    });


