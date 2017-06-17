var reviews = [];
var sentiments = [];

var all_reviews = [];
var selected_restaurant = 0;

var options = {
    url: function() {
        return "http://localhost:8000/scripts_and_data/restaurants_ids.json";
    },
    getValue: "name",
    list: {
    onSelectItemEvent: function() {
        var index = $("#search-box").getSelectedItemData().id;
        console.log(index);
        selected_restaurant = index;
    }}
};

$(document).ready( function() {
    $("#search-box").easyAutocomplete(options);
});


getData = function() {
    $.ajax({
        dataType: "json",
        url: "http://localhost:8000/scripts_and_data/reviews_with_sentiments.json",
        }).done(function(data) {

            all_reviews = _.find(data, function(restaurant) { return restaurant[selected_restaurant]}).reviews;
            $.each(all_reviews, function(index, obj) {
                var date = new Date(obj.datetime);
                reviews.push(new Array(Date.UTC(date.getFullYear(),date.getMonth(), date.getDate()), obj.rating));
                sentiments.push(new Array(Date.UTC(date.getFullYear(),date.getMonth(), date.getDate()), obj.sentiment));
            });
            drawChart();
            drawSentimentChart();
            showReviews();
        });
};

drawSentimentChart = function() {

    $('.sentiment-chart').css("display","block");
    Highcharts.chart('sentiment-container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Sentiments over time'
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
                text: 'Sentiment of reviews'
            },
            max: 5,
            min: 0
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
                        y2: 300
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
            name: 'Sentiments',
            data: sentiments
        }]
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
            },
            max: 5,
            min: 0
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

showReviews = function() {
    $('#reviews').append("<h2> Top reviews </h2>");

    for(var i=0; i<5; i++) {
        $('#reviews').append( "<div class='review'> <div class='rating'> <b> Rating </b> " +all_reviews[i].rating + "<br/>" +  all_reviews[i].rating_text + "</div>");
    }


}
