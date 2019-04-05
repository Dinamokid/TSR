function bblSort(a) {
    a = a.split(',').map(function (item) {
        return parseInt(item, 10);
    });

    window.operationCount = 0;

    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a.length; j++) {
            $(".console").append("<p>#" + operationCount + ": " + a + "</p>");
            if (a[j] > a[j + 1]) {
                var temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
            operationCount++;
            DrawChart(a);
        }
    }
    return a;
}

$(document).ready(function () {
    $(`[name='numbers']`).on("change", function () {
        $(".console").empty();
    });
});

function DrawChart(a) {
    var ctx = document.getElementById('myChart');
    var myChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
            labels: a,
            datasets: [{
                label: 'Bubble Sort',
                data: a,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animationDuration: 0,
            intersect: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}