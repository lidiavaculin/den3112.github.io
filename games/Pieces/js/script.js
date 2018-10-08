var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var pieces = new Array;

for (i = 0; i < 12; i++) {
    pieces[i] = new Object;
    pieces[i].color = 'black';
}
for (i = 12; i < 24; i++) {
    pieces[i] = new Object;
    pieces[i].color = 'white';
}

for (i = 0; i < 8; i++) {
    for (j = 0; j < 8; j++) {
        if ((i + j) % 2 == 0) {
            ctx.fillStyle = "#dda871";
        } else {
            ctx.fillStyle = "#40250e";
        }
        ctx.fillRect(j * 100, i * 100, 100, 100);
    }
}

for (i = 0; i < 3; i++) {
    for (j = 0; j < 4; j++) {
        drawPiece('black', j * 200 + (i + 1) % 2 * 100, i * 100);
        pieces[i * 4 + j].coordX = j * 200 + (i + 1) % 2 * 100;
        pieces[i * 4 + j].coordY = i * 100;

        drawPiece('white', j * 200 + i % 2 * 100, 500 + i * 100);
        pieces[12 + i * 4 + j].coordX = j * 200 + i % 2 * 100;
        pieces[12 + i * 4 + j].coordY = 500 + i * 100;
    }
}

function drawPiece(color, coordX, coordY) {
    if (color == 'white') {
        circle('#e8cd7d', coordX, coordY, 40);
        circle('#ffeec2', coordX, coordY, 30);
    }
    if (color == 'white select') {
        circle('#99b34d', coordX, coordY, 40);
        circle('#ccd366', coordX, coordY, 30);
    }
    if (color == 'white block') {
        circle('#f2b90d', coordX, coordY, 40);
        circle('#fae39e', coordX, coordY, 30);
    }
    if (color == 'black') {
        circle('#00000a', coordX, coordY, 40);
        circle('#1c2a34', coordX, coordY, 30);
    }
    if (color == 'black select') {
        circle('#303c58', coordX, coordY, 40);
        circle('#4b5f9b', coordX, coordY, 30);
    }
    if (color == 'black block') {
        circle('#2d2640', coordX, coordY, 40);
        circle('#534c67', coordX, coordY, 30);
    }
}

function circle(color, coordX, coordY, size) {
    ctx.beginPath();
    ctx.arc(50 + coordX, 50 + coordY, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function move(i, posX, posY) {
    ctx.fillStyle = "#40250e";
    ctx.fillRect(pieces[i].coordX, pieces[i].coordY, 100, 100);
    pieces[i].coordX = posX;
    pieces[i].coordY = posY;
}

var field = document.getElementById("turn");
function changePlayer() {
    if (player == "white") {
        player = "black";
        field.innerHTML = "Black turn";
        return;
    }
    if (player == "black") {
        player = "white";
        field.innerHTML = "White turn";
        return;
    }
}

function cellName(coordX, coordY) {
    var letter;
    switch (coordX) {
        case 0:
            letter = "A";
            break;
        case 100:
            letter = "B";
            break;
        case 200:
            letter = "C";
            break;
        case 300:
            letter = "D";
            break;
        case 400:
            letter = "E";
            break;
        case 500:
            letter = "F";
            break;
        case 600:
            letter = "G";
            break;
        case 700:
            letter = "H";
            break;
    }
    return letter + (8 - coordY / 100);
}

var columns = new Array;
for(i = 0; i < 5; i++){
    columns[i] = document.getElementById("column" + i);
}
var currentLine = 0;
var currentColumn = 0;
function writeLog(posX, posY){
    if(currentLine > 20){
        currentLine = 0;
        currentColumn++;
    }
    columns[currentColumn].innerHTML += (currentColumn * 15 + currentLine + 1) + ".  " + pieces[selected].color + ": " + cellName(pieces[selected].coordX, pieces[selected].coordY) +    " - " + cellName(posX, posY) + "<br>";
    currentLine++;
}

function isBlocking(i) {
    if (pieces[i].color == player) {
        var blocking = false;
        for (x = 0; x <= 1; x++) {
            for (y = 0; y <= 1; y++) {
                var nearCell = false;
                var jumpCell = false;

                nearX = pieces[i].coordX + 100 * (2 * x - 1);
                nearY = pieces[i].coordY + 100 * (2 * y - 1);
                jumpX = pieces[i].coordX + 200 * (2 * x - 1);
                jumpY = pieces[i].coordY + 200 * (2 * y - 1);

                for (j = 0; j < 24; j++) {
                    if (pieces[j].coordX == nearX & pieces[j].coordY == nearY & pieces[j].color != player &
                        (nearX != 0 & nearX != 700) & (nearY != 0 & nearY != 700)) {
                        nearCell = true;
                    }
                    if (pieces[j].coordX == jumpX & pieces[j].coordY == jumpY |
                        (jumpX < 0 | jumpX > 700) | (jumpY < 0 | jumpY > 700)) {
                        jumpCell = true;
                    }
                }
                if (nearCell & !jumpCell) {
                    blocking = true;
                }
            }
        }

        if (blocking) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


var selected = -1;
var player = "white";
var blocked = false;
var whiteLeft = 12;
var blackLeft = 12;
var gameEnded = false;

function clicked(event) {
    
    if(gameEnded){
        return;
    }
    
    var canvasPos = canvas.getBoundingClientRect();
    var canvasPosX = canvasPos.left + pageXOffset;
    var canvasPosY = canvasPos.top + pageYOffset;
    var clickX = (event.pageX - canvasPosX) - (event.pageX - canvasPosX) % 100;
    var clickY = (event.pageY - canvasPosY) - (event.pageY - canvasPosY) % 100;

    clickedCell = -1;
    for (i = 0; i < 24; i++) {
        if (clickX == pieces[i].coordX & clickY == pieces[i].coordY) {
            clickedCell = i;
        }
    }
    if ((clickedCell != -1) && (pieces[clickedCell].color == player && (isBlocking(clickedCell) | blocked == false))) {
        selected = clickedCell;
    }

    if (clickedCell == -1) {
        if ((selected != -1) &&
            (!blocked) &
            (clickX == pieces[selected].coordX + 100 | clickX == pieces[selected].coordX - 100) &
            ((clickY == pieces[selected].coordY + 100 & pieces[selected].color == "black") |
                (clickY == pieces[selected].coordY - 100 & pieces[selected].color == "white"))) {

            writeLog(clickX, clickY);
            move(selected, clickX, clickY);
            selected = -1;
            changePlayer();
        }

        if ((selected != -1) &&
            (clickX == pieces[selected].coordX + 200 | clickX == pieces[selected].coordX - 200) &
            (clickY == pieces[selected].coordY + 200 | clickY == pieces[selected].coordY - 200)) {

            eatenCell = new Object;
            eatenCell.color = "empty"
            eatenCell.coordX = (clickX + pieces[selected].coordX) / 2;
            eatenCell.coordY = (clickY + pieces[selected].coordY) / 2;

            for (i = 0; i < 24; i++) {
                if (eatenCell.coordX == pieces[i].coordX & eatenCell.coordY == pieces[i].coordY) {
                    eatenCell.color = pieces[i].color;
                    eatenCell.pieceNumber = i;
                }
            }

            if (eatenCell.color != "empty" & eatenCell.color != player) {
                writeLog(clickX, clickY);
                move(selected, clickX, clickY);
                move(eatenCell.pieceNumber, 1000, 1000);
                if(player == "white"){
                    blackLeft--;
                }
                if(player == "black"){
                    whiteLeft--;
                }
                if (!isBlocking(selected)) {
                    changePlayer();
                    selected = -1;
                }
            }
        }
    }

    blocked = false;
    for (i = 0; i < 24; i++) {
        if (isBlocking(i)) {
            blocked = true;
            drawPiece(pieces[i].color + ' block', pieces[i].coordX, pieces[i].coordY);
        } else {
            drawPiece(pieces[i].color, pieces[i].coordX, pieces[i].coordY);
        }
        if (selected == i) {
            drawPiece(pieces[i].color + ' select', pieces[i].coordX, pieces[i].coordY)
        }
    }
    
    if(blackLeft == 0){
        gameEnded = true;
        field.innerHTML = "White wins"
    }
    if(whiteLeft == 0){
        gameEnded = true;
        field.innerHTML = "Black wins"
    }
}