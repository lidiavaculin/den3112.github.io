var aud = document.getElementById("myAudio");
aud.volume = 0.2;

initializeTimer(); // вызываем функцию инициализации таймера

var random = Math.floor(Math.random() * (30 - 25+ 1)) + 30;

window.onload=mapGen("#canvas", 45, random, 0, 0);


function mapGen(map, cellInWidth, cellInHeight, coordinateX, level) {
    //Управление персонажем
    function character(coordinateX, coordinateY) {
        //Пиксель между текущей ячейкой и следующей на пути
        var pixelColor = field.getImageData(15 * currentX + 7 + 6 * coordinateX, 15 * currentY + 7 + 6 * coordinateY, 1, 1);
        // Если пиксель черный, то не перемещаем персонажа, иначе увеличиваем количество шагов
        0 == pixelColor.data[0] && 0 == pixelColor.data[1] && 0 == pixelColor.data[2] && 255 == pixelColor.data[3] ? coordinateX = coordinateY = 0 : document.querySelector("#step").innerHTML = Math.floor(document.querySelector("#step").innerHTML) + 1;
        // Закрашиваем персонажа
        field.fillStyle = "red";
        field.fillRect(15 * currentX + 3, 15 * currentY + 3, 10, 10);
        field.fillStyle = "blue";
        // Меняем его текушие координаты
        currentX += coordinateX;
        currentY += coordinateY;
        // Вновь отрисовываем его
        field.fillRect(3 + 15 * currentX, 3 + 15 * currentY, 10, 10);

        // Если персонаж вышел за пределы лабиринта, то генерируем новый лабиринт и начинаем игру сначала
        if (currentX >= cellInWidth) {
            level++;
            document.querySelector("#myText").innerHTML ="Ура, вы прошли уровень "+level;
            mapGen("#canvas", cellInWidth, cellInHeight, 0, level);
        }
    }
    //Наша область игры
    map = document.querySelector(map);
    var field = map.getContext("2d");

    // Увеличиваем количество шагов и пройденных лабиринтов
    document.querySelector("#step").innerHTML = Math.floor(coordinateX);
    document.querySelector("#complete").innerHTML = Math.floor(level);

    //Область нашего лабиринта красим в чёрный цвет
    map.width = 15 * cellInWidth + 3;
    map.height = 15 * cellInHeight + 3;
    field.fillStyle = "black";
    field.fillRect(0, 0, 15 * cellInWidth + 3, 15 * cellInHeight + 3);

    // Объявим массивы для хранения значения множества текущей ячейки, для значения стенки справа и для значения стенки снизу
    coordinateX = Array(cellInWidth);
    map = Array(cellInWidth);
    var k = Array(cellInWidth),
        // Текущее множество
        q = 1;

    // Цикл по строкам
    for (cr_l = 0; cr_l < cellInHeight; cr_l++) {
        // Проверка принадлежности ячейки в строке к какому-либо множеству        
        for (i = 0; i < cellInWidth; i++) {
            cr_l == 0 && (coordinateX[i] = 0);
            field.clearRect(15 * i + 3, 15 * cr_l + 3, 10, 10);
            k[i] = 0;
            map[i] == 1 && (map[i] = coordinateX[i] = 0);
            coordinateX[i] == 0 && (coordinateX[i] = q++);
        }

        // Создание случайным образом стенок справа и снизу
        for (i = 0; i < cellInWidth; i++) {
            k[i] = Math.floor(2 * Math.random()), map[i] = Math.floor(2 * Math.random());

            if ((0 == k[i] || cr_l == cellInHeight - 1) && i != cellInWidth - 1 && coordinateX[i + 1] != coordinateX[i]) {
                var l = coordinateX[i + 1];
                for (j = 0; j < cellInWidth; j++) coordinateX[j] == l && (coordinateX[j] = coordinateX[i]);
                field.clearRect(15 * i + 3, 15 * cr_l + 3, 15, 10)
            }
            cr_l != cellInHeight - 1 && 0 == map[i] && field.clearRect(15 * i + 3, 15 * cr_l + 3, 10, 15)
        }

        // Смотрим замкнутые области.
        for (i = 0; i < cellInWidth; i++) {
            var p = l = 0;
            for (j = 0; j < cellInWidth; j++) {
                if (coordinateX[i] == coordinateX[j] && map[j] == 0) {
                    p++;
                } else {
                    l++;
                }
            }
            p == 0 && (map[i] = 0, field.clearRect(15 * i + 3, 15 * cr_l + 3, 10, 15));
        }
    }

    //Выход из лабиринта
    field.clearRect(15 * cellInWidth - 3, 3, 15, 10);
    // Текущие координаты нулевые
    var currentX = 0,
        currentY = 0;
    // Задаем крассный цвет
    field.fillStyle = "blue";
    // И ставим персонажа в начало лабиринта
    character(-1, -1);
    // Ожидаем нажатия стрелок
    document.body.onkeydown = function(a) {
        if (36 < a.keyCode && 41 > a.keyCode) {
            character((a.keyCode - 38) % 2, (a.keyCode - 39) % 2);
        }
    }

}




function initializeTimer() { 
    var currentDate = new Date(); // текущая дата
    var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes()+15, currentDate.getSeconds()); // получаем дату истечения таймера
    var seconds = (endDate - currentDate) / 1000; // определяем количество секунд до истечения таймера
    var minutes = seconds / 60; // определяем количество минут до истечения таймера
    
    seconds = Math.floor((minutes - Math.floor(minutes)) * 60); // подсчитываем кол-во оставшихся секунд в текущей минуте
    minutes = Math.floor(minutes); // округляем до целого кол-во оставшихся минут в текущем часе

    setTimePage(minutes, seconds); // выставляем начальные значения таймера

    function secOut() {
        if (seconds == 0) { // если секунду закончились то
            if (minutes == 0) { // если минуты закончились то
                    showMessage(timerId); // выводим сообщение об окончании отсчета
            } else {
                minutes--; // уменьшаем кол-во минут
                seconds = 59; // обновляем секунды
            }
        } else {
            seconds--; // уменьшаем кол-во секунд
        }
        setTimePage( minutes, seconds); // обновляем значения таймера на странице
    }
    var timerId = setInterval(secOut, 1000) // устанавливаем вызов функции через каждую секунду
}

function setTimePage(m, s) { // функция выставления таймера на странице
    var element = document.getElementById("timer"); // находим элемент с id = timer
    element.innerHTML = "Минуты:" + m + "<br>Секунды:" + s; // выставляем новые значения таймеру на странице
}

function showMessage(timerId) { // функция, вызываемая по истечению времени
    alert("Game over!");
    clearInterval(timerId); // останавливаем вызов функции через каждую секунду
    location.reload(true);
}


