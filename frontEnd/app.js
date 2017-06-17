var reviews = [];

getData = function() {
    $.ajax({
        dataType: "json",
        url: "http://localhost:8000/scripts_and_data/data.json",
        }).done(function(data) {
            $.each(data, function(index, obj) {
                obj[0] = new Date(1000*obj[0].toString()).toLocaleDateString();
            });
            reviews=data;
            drawChart()
        });
};

drawChart = function() {
    $('.chart').css("display","block");
    $('.search-container').css("padding-top","50px");
    Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'User Rating over time'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            title: {
                text: 'Period'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Rating'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'User Ratings',
            data: reviews
        }]
    });
};
