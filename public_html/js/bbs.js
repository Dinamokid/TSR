window.ctx = document.getElementById('myChart'); //получаем холст
window.stepIndex = 0; //индекс текущего шага

function bblSort(data) {
    if (!isNaN(data)) { //проверка наличия значений
        toastr["error"]("Не ломай меня!");
        return;
    };

    ChartDestroy(); //сброс от предыдущего графика
    window.Steps = new Array(); //сброс массива шагов
    window.stepIndex = 0; //сброс индекса шага

    $("#buttons").show(); //отображаем кнопки управления анимацией
    $('#InputArray').text(data); //отображаем исходный массив

    if (typeof (data[0]) === "string") //проверяем какого типа данные поступили на вход, если это строка, то разбиваем запятыми
        data = data.split(',').map(function (item) {
            return parseInt(item, 10) || 0; //если невозможно спарсить заменяем на ноль
        });

    window.myLineChart = new window.Chart(ctx, SetConfig(data)); //инциализация графика

    for (var i = 0; i < data.length; i++) {
        for (var j = 0, flyugegekhajmen = data.length - i; j < flyugegekhajmen; j++) { //flyugegekhajmen - стоп-слово :)
            if (j !== 0) { //для правильного отображения 
                Steps.push({ //добавляем класс анонимного типа в массив шагов
                    data: data.slice(),
                    j: j - 1,
                    stop: flyugegekhajmen
                });
            }
            Steps.push({ //добавляем класс анонимного типа в массив шагов
                data: data.slice(),
                j: j,
                stop: flyugegekhajmen
            });
            if (data[j] > data[j + 1]) { //вызывается функция замены в ситуации при которой текущий элемент больше следующего
                Swap(j, data);
            }
        }
    }

    $('#OutputArray').text(data); //добавляем результат в предтавление

    StepByStep(stepIndex); //первый шаг
}

function Swap(j, data) { //меняем местами переменные
    var temp = data[j];
    data[j] = data[j + 1];
    data[j + 1] = temp;
}

function StepByStep(operationIndex) {
    if (operationIndex < Steps.length && operationIndex > -1) { //очень важные проверки )
        Update(Steps[operationIndex].data, Steps[operationIndex].j, Steps[operationIndex].stop); //обновление графика
    } else {
        toastr["error"]("Не ломай меня!");
    }
}

function Update(data, j, stop) {
    myLineChart.data.datasets.shift(); //очищаем массив данных графика
    myLineChart.data.datasets.push(//добавляем данные
        {
            label: 'Bubble Sort',
            data: data,
            backgroundColor: ChangeBGColor(j, data.length, stop) //определение цветов столбиков
        }
    );
    myLineChart.data.labels = data; //обновление подписей к столбикам
    myLineChart.update(); //обновление графика
}

function ChangeBGColor(j, count, stop) { //цвет значений в графике
    var colors = new Array();
    for (var i = 0; i < count; i++) {
        if (i < stop) {
            if (i === j || i === j + 1) {
                colors.push('rgba(82, 152, 255, 0.5)'); //выделение текущей операции шага
            } else {
                colors.push('rgba(97, 171, 64, 0.5)');
            }
        } else {
            colors.push('rgb(255, 204, 0, 0.5)'); //цвет отсортированных
        }
    }
    return colors;
}

$(document).ready(function () {
    $(`[name='numbers']`).on("change", ChartDestroy()); //вызов очистки при изменении поля ввода
});

function PrevStepIndex() { //шаг назад
    if (stepIndex > 0) {
        StepByStep(stepIndex -= 1);
    } else {
        toastr['info']('Вы достигли начала сортировки');
    }
}
function NextStepIndex() { //шаг вперед
    if (stepIndex !== Steps.length - 1) {
        StepByStep(window.stepIndex += 1);
        if (stepIndex === Steps.length - 1) {
            Update(Steps[Steps.length - 1].data, 0, -1); //вызывается для последнего шага
        }
    } else {
        window.AutoPlay = false; //отключение автоплея
        toastr['info']('Вы достигли конца сортировки');
    }
}

function ChartDestroy() { //очистка графика с проверкой на существование
    if (typeof myLineChart !== "undefined") {
        myLineChart.destroy(myLineChart);
    }
}

function SetConfig(data) { //конфиг для графика
    window.charConfig = {
        type: 'bar',
        data: {
            labels: data,
            title: "Bubble Sort",
            datasets: [
                {
                    label: 'Bubble Sort',
                    data: data,
                    backgroundColor: 'rgba(97, 171, 64, 0.5)'
                }
            ]
        },
        options: {
            animation: false,
            animationDuration: 0,
            easing: 'linear',
            intersect: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };
    return charConfig;
}

function generateData() { //генерация массива случайных значений
    var data = [];
    for (var i = 0; i < rand(5, 20); i++) {
        data.push(rand(1, 20));
    }
    return data;
}

function rand(min, max) { //генерация случайного значения
    var randomValue = min - 0.5 + Math.random() * (max - min + 1); //хитрая )
    randomValue = Math.round(randomValue);
    return randomValue;
}

function AutoStep(speed) { //автоматическое воспроиведение анимации графика
    var i = 0;
    window.AutoPlay = true;
    var timerId = setInterval(function () {
        NextStepIndex();
        if (i === Steps.length - 1 || AutoPlay === false) clearInterval(timerId);
        i++;
    }, speed);
}

$(document).ready(function () { //анимация при старте прогрузка
    bblSort(generateData());
    AutoStep(300);
});
