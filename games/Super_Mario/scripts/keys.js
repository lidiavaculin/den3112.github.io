/*
    Описани функционала кнопок
*/
var keys = {
    bind: function () {
        $(document).on('keydown', function (event) {
            return keys.handler(event, true);
        });
        $(document).on('keyup', function (event) {
            return keys.handler(event, false);
        });
    },
    reset: function () {
        keys.left = false;
        keys.right = false;
        keys.accelerate = false;
        keys.up = false;
        keys.down = false;
    },
    unbind: function () {
        $(document).off('keydown');
        $(document).off('keyup');
    },
    handler: function (event, status) {
        switch (event.keyCode) {
            case 17://CTRL
                keys.accelerate = status;
                break;
            case 40://DOWN ARROW
                keys.down = status;
                break;
            case 39://RIGHT ARROW
                keys.right = status;
                break;
            case 37://LEFT ARROW
                keys.left = status;
                break;
            case 38://UP ARROW
                keys.up = status;
                break;
            default:
                return true;
        }
        event.preventDefault();
        return false;
    },
    accelerate: false,
    left: false,
    up: false,
    right: false,
    down: false,
}

document.getElementById('newgame').onclick = function () {
    function load(url) {
        var e = document.createElement("script");
        e.src = "Scripts/main.js";
        e.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
    load();

    document.getElementById('menu').style.background = 'none';
    document.getElementById('newgame').style.visibility = 'hidden';
    document.getElementById('controls').style.visibility = 'hidden';
    document.getElementById('windows').style.visibility = 'hidden';
    document.getElementById('android').style.visibility = 'hidden';
    document.getElementById('youtube').style.visibility = 'hidden';
}

document.getElementById('controls').onclick = function () {
    document.getElementById('controllpage').style.visibility = 'visible';
}

document.getElementById('exit_controllpage').onclick = function () {
    document.getElementById('controllpage').style.visibility = 'hidden';
}