var margin = {
        top: 50,
        right: 150,
        bottom: 50,
        left: 50
    },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var valueline = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
}

function make_y_axis() {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
}

var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', '0');

d3.csv('data.csv', function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d.name = d.Name;
        d.date1 = +d.Date1;
        d.date2 = +d.Date2;
    });

    var data_keys = Object.keys(data[0]);

    var conv_data = [];

    for (var i = 0; i < data.length; i++) {
        data1 = [0, data[i].date1];
        data2 = [1, data[i].date2];

        conv_data.push([data1, data2]);
    };

    x.domain([0, 1]);
    y.domain([d3.min(conv_data, function(d) {
        return Math.min(d[0][1], d[1][1]);
    }), d3.max(conv_data, function(d) {
        return Math.max(d[0][1], d[1][1]);
    })]);

    svg.append("g")
        .attr('class', "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    for (var i = 0; i < data.length; i++) {

        var d_data = conv_data[i];

        svg.append('path')
            .data([d_data])
            .attr('class', 'line')
            .attr('id', function(d) {
                return i;
            })
            .attr('d', valueline)
            .style('stroke', "grey")
            .on('mouseover', function(d) {
                d3.select(this)
                    .transition().duration(100)
                    .style('stroke-width', '2px')
                    .style('stroke', 'steelblue');
                div.transition().duration(300)
                    .style('opacity', .8);
                div.html(data[this.id].Name +
                        '<br>' + data[this.id].Date1 +
                        ' → ' + data[this.id].Date2)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition().delay(50).duration(100)
                    .style('stroke-width', '1.5px')
                    .style('stroke', 'grey')
                div.transition().duration(300)
                    .style('opacity', 0);
            });

        svg.append('text')
            .attr('class', 'v_label')
            .attr('x', width + 10)
            .attr('y', y(d_data[1][1]))
            .attr('transform', 'translate(0,0)')
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .style('fill', 'grey')
            .text(function(d) {
                if ((data[i].Date2 - data[i].Date1) > 0) {
                    return "+" + (data[i].Date2 - data[i].Date1) + "  " + data[i].Name;
                } else {
                    return (data[i].Date2 - data[i].Date1) + "  " + data[i].Name;
                };
            });

    };

    var yAxis = d3.svg.axis().scale(y).orient("left");

    svg.append('g')
        .attr('class', 'yaxis')
        .call(yAxis);

    svg.append('text')
        .attr('class', 'x_lab')
        .attr('x', 0)
        .attr('y', height + (margin.bottom / 2))
        .attr('transform', 'translate(0,0)')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .text(function(d) {
            return data_keys[1];
        });

    svg.append('text')
        .attr('class', 'x_lab')
        .attr('x', 0)
        .attr('y', height + (margin.bottom / 2))
        .attr('transform', 'translate(' + width + ',0)')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .text(function(d) {
            return data_keys[2];
        });

});