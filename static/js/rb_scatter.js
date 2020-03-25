    filePath = 'csv/2019_gaps.csv';
    var rbFilePath = 'csv/rb_plays_2019.json';
    
    var fileData;
    var playerFileData;
    var selectedText;
    var rb;
    
    
    // Load in data from csv
    d3.csv(filePath).then(info => {
        fileData = info;
        // console.log('Printing filePath data:');
        // console.log(fileData);
        // console.log('Names:');
        // console.log(fileData.names);
        // d3.selectAll("RB1").on("change", init());
    });
    
    // Load in data from json
    d3.json(rbFilePath).then(info => {
        playerFileData = info;
        names = [];
        rush_epa = [];
        pass_epa = [];
        Object.entries(playerFileData).forEach(([key, value]) => {
            names.push(key);
            // console.log(value.run.epa);
            rush_sum = 0;
            pass_sum = 0;
            for (i = 0; i < value.run.epa.length; i++) {
                run_val = value.run.epa[i];
                if (run_val != 'N/A') {
                    rush_sum += run_val;
                }
            }
            for (i = 0; i < value.pass.epa.length; i++) {
                pass_val = value.run.epa[i];
                if (pass_val != 'N/A') {
                    pass_sum += run_val;
                }
            }

            rush_sum = rush_sum || 0;

            pass_sum = pass_sum || 0;

            rush_epa.push((rush_sum / value.run.epa.length) || 0);
            pass_epa.push((pass_sum / value.pass.epa.length) || 0);

        });

        data = {'names': names, 'rush_epa': rush_epa, 'pass_epa': pass_epa };
        // console.log(data);

        makeVis(data);
    });

    var makeVis = function(data){
        // Common pattern for defining vis size and margins
        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Add the visualization svg canvas to the vis-container <div>
        var canvas = d3.select("#rb_scatter").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // d3.selectAll("RB1").on("change", init());

        // Define our scales
        var colorScale = d3.scale.category10();
        // console.log(colorScale);

        var xScale = d3.scale.linear()
            .domain([d3.min(data.rush_epa, function (d) { return d; }) - 1,
            d3.max(data.rush_epa, function (d) { return d; }) + 1])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([d3.min(data.pass_epa, function (d) { return d; }) - 1,
            d3.max(data.pass_epa, function (d) { return d; }) + 1])
            .range([height, 0]); // flip order because y-axis origin is upper LEFT

        // Define our axes
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        // Add x-axis to the canvas
        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width) // x-offset from the xAxis, move label all the way to the right
            .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
            .style("text-anchor", "end") // right-justify text
            .text("Rush EPA/Play");

        // Add y-axis to the canvas
        canvas.append("g")
            .attr("class", "y axis") // .orient('left') took care of axis positioning for us
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)") // although axis is rotated, text is not
            .attr("y", 15) // y-offset from yAxis, moves text to the RIGHT because it's rotated, and positive y is DOWN
            .style("text-anchor", "end")
            .text("Pass EPA/Play");

        // Add the tooltip container to the vis container
        // it's invisible and its position/contents are defined during mouseover
        var tooltip = d3.select("#rb_scatter").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        // tooltip mouseover event handler
        var tipMouseover = function (d) {
            var color = colorScale(d.names);
            var html = "<span style='color:" + color + ";'>" + d.names + "</span><br/>" +
                "<b>Pass EPA/Play: </b>" + d.pass_epa + "<b/>Rush EPA/Play: </b>" + d.rush_epa;

            tooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200) // ms
                .style("opacity", .9) // started as 0!
        };
        // tooltip mouseout event handler
        var tipMouseout = function (d) {
            tooltip.transition()
                .duration(300) // ms
                .style("opacity", 0); // don't care about position!
        };

        // Add data points!
        canvas.append('g').selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 5.5) // radius size, could map to another data dimension
            .attr("cx", function (d) { 
                console.log(d.rush_epa);
                return xScale(d.rush_epa); })     // x position
            .attr("cy", function (d) { 
                console.log(d.pass_epa);
                return yScale(d.pass_epa); })  // y position
            // .style("fill", function (d) { return colorScale(d.names); })
            .style("fill", "black")
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout);
    }

