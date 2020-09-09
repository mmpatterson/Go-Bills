filePath2 = 'csv/2019_gaps.csv';
var rbfilePath2 = 'csv/rb_plays_2019.json';

var fileData2;
var playerfileData2;
var selectedText2;
var rb2;


// Load in data from csv
d3.csv(filePath2).then(info => {
    fileData2 = info;
    // console.log('Printing filePath2 data:');
    // console.log(fileData2);
    // console.log('Names:');
    // console.log(fileData2.names);
    d3.selectAll("RB2").on("change", init2());
});

// Load in data from json
d3.json(rbfilePath2).then(info => {
    playerfileData2 = info;
    // console.log(playerfileData2);
    d3.selectAll("RB2").on("change", init2());
});

/*
* Function initializes the data that appear in the dropdown
*/
function init2() {
    var dropNames = ['Choose-RB'];
    for (i = 0; i < fileData2.length; i++){
        dropNames.push(fileData2[i].rb_name)
    }
    // console.log('Printing dropNames:')
    // console.log(dropNames);
    var selector = d3.select("#selDataset2");
    dropNames.forEach(individual => {
        selector
            .append("option")
            .text(individual)
            .property("value", individual);
    });
    optionChanged2(fileData2.rb_name);
}

function demInfo2(rb){
    rush_yards = playerFileData[rb].run.yards_gained.reduce(function(a, b){
        return a + b;
    }, 0);
    // console.log('Rush Yards:', rush_yards);

    // console.log('Rush EPA: ', playerFileData[rb].run.epa);
    // rush_epa = playerFileData[rb].run.epa.reduce(function(a, b){
    //     return a + b;
    // }, 0);
    var rush_epa = 0;

    // Added bug solution- 'N/A' was value for EPA for some plays, which caused 
    // script to thing we wanted to append all EPAs together as strings
    for(i = 0; i<playerFileData[rb].run.epa.length;i++){
        val = playerFileData[rb].run.epa[i]
        if(val != 'N/A'){
            rush_epa += val;
        }
    }

    rush_touchdowns = playerFileData[rb].run.rush_touchdown.reduce(function(a, b){
        return a + b;
    }, 0);

    rec_yards = playerFileData[rb].pass.yards_gained.reduce(function(a, b){
        return a + b;
    }, 0);

    rec_epa = playerFileData[rb].pass.epa.reduce(function(a, b){
        return a + b;
    }, 0);

    pass_touchdowns = playerFileData[rb].pass.pass_touchdown.reduce(function(a, b){
        return a + b;
    }, 0);

    // console.log("Rush EPA", rush_epa);

    player_info2 = {"Rushing Yards": rush_yards, "Rushing Total EPA": rush_epa.toFixed(2), "Rushing Touchdowns": rush_touchdowns, "Receiving Yards": rec_yards, 
        "Receiving Total EPA": rec_epa.toFixed(2), "Receiving Touchdowns": pass_touchdowns};

    d3.select("#demInfo2").selectAll("div").remove(); 

    var selection = d3.select('#demInfo2');
    selection.html("");
    Object.entries(player_info2).forEach(([key, value]) => {
        selection.append('div').text(`${key}: ${value}`)
    })
}
/*
* Creates the bar chart
*/
function buildPlot2(rb2) {
    //  console.log("The Data:")
    //  console.log(fileData2);
    //  var individual = fileData2.filter(player => player.rb_name == rb);
    var individual;
    var index;
    // console.log('FileData2: ', fileData2);
    for (i = 0; i < fileData2.length; i++){
        if(fileData2[i].rb_name == rb2){
            index = i;
            individual = fileData2[index];
        }
    }
    //  console.log("Printing Individual");
    //  console.log(individual.rb_name);
    //  Get the gap names
     var gaps = [individual.left_end, individual.left_tackle, individual.left_guard, individual.right_guard, 
        individual.right_tackle, individual.right_end];
     gapsString = gaps.map(d => d);
    //  console.log('Gaps:');
    //  console.log(gaps);

    // // Create Horizontal Bar Chart trace
     var trace1 = {
         type: "bar",
         x: ['Left End (C Gap)', 'Left Tackle (B Gap)', 'Left Guard (A Gap)', 'Right Guard (A Gap)', 'Right Tackle (B Gap)',
          'Right End (C Gap)'],
         y: gaps,
        //  text: otuLabels,
         marker: {
            // This blue is a cool color
            color: 'rgb(43,140,190)'
         },
         orientation: 'v'
     };

    // //  Put the data in an array
     var player = [trace1];

    //  Define the layout
     var layout = {
         title: 'Rush Percentage by Gap: ' + individual.rb_name,
         height: 600,
         width: 400,
         xaxis: {title:'Gap'
         },
         yaxis: {title:'Percentage of Runs'
         }
     };
    // // Create the bar chart
    //  Plotly.newPlot("bar", player, layout);
    Plotly.newPlot("rb_gaps2", player, layout);
    // buildPlot(player)
}

function rushEpaPlot2() {
    var color = "steelblue";
    rb2 = document.getElementById('selDataset2').value;
    values = playerfileData2[rb2].run.epa;

    var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
      .domain([-7, 7])
      .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
    .bins(x.ticks(40))
    (values);

      var yMax = d3.max(data, function(d){return d.length});
      var yMin = d3.min(data, function(d){return d.length});
      var colorScale = d3.scale.linear()
                  .domain([yMin, yMax])
                  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
      
      var y = d3.scale.linear()
          .domain([0, yMax])
          .range([height, 0]);
      
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      
      d3.select("#rush_epa2").select("svg").remove(); 

      var svg = d3.select("#rush_epa2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var bar = svg.selectAll(".bar")
          .data(data)
          .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
      
      bar.append("rect")
          .attr("x", 1)
          .attr("width", (x(data[0].dx) - x(0)) - 1)
          .attr("height", function(d) { return height - y(d.y); })
          .attr("fill", function(d) { return colorScale(d.y) });
      
      bar.append("text")
          .attr("dy", ".75em")
          .attr("font-size","12px")
          .attr("y", -12)
          .attr("x", (x(data[0].dx) - x(0)) / 2)
          .attr("text-anchor", "middle")
          .text(function(d) { return d.y; })
        ;
      
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
}

function recEpaPlot2() {
    var color = "steelblue";
    rb2 = document.getElementById('selDataset2').value;
    rec_values = playerfileData2[rb2].pass.epa;

    var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
      .domain([-7, 7])
      .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
    .bins(x.ticks(40))
    (rec_values);

      var yMax = d3.max(data, function(d){return d.length});
      var yMin = d3.min(data, function(d){return d.length});
      var colorScale = d3.scale.linear()
                  .domain([yMin, yMax])
                  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
      
      var y = d3.scale.linear()
          .domain([0, yMax])
          .range([height, 0]);
      
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      
      d3.select("#rec_epa2").select("svg").remove(); 

      var svg2 = d3.select("#rec_epa2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var bar2 = svg2.selectAll(".bar")
          .data(data)
          .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
      
      bar2.append("rect")
          .attr("x", 1)
          .attr("width", (x(data[0].dx) - x(0)) - 1)
          .attr("height", function(d) { return height - y(d.y); })
          .attr("fill", function(d) { return colorScale(d.y) });
      
      bar2.append("text")
          .attr("dy", ".75em")
          .attr("font-size","12px")
          .attr("y", -12)
          .attr("x", (x(data[0].dx) - x(0)) / 2)
          .attr("text-anchor", "middle")
          .text(function(d) { return d.y; })
        ;
      
      svg2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
}

function rushWpaPlot2() {
    var color = "steelblue";
    rb2 = document.getElementById('selDataset2').value;
    values = playerfileData2[rb2].run.win_probability_added;

    var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

      var yMax = d3.max(data, function(d){return d.length});
      var yMin = d3.min(data, function(d){return d.length});
      var colorScale = d3.scale.linear()
                  .domain([yMin, yMax])
                  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
      
      var y = d3.scale.linear()
          .domain([0, yMax])
          .range([height, 0]);
      
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      
      d3.select("#rush_Wpa2").select("svg").remove(); 

      var svg = d3.select("#rush_Wpa2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var bar = svg.selectAll(".bar")
          .data(data)
          .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
      
      bar.append("rect")
          .attr("x", 1)
          .attr("width", (x(data[0].dx) - x(0)) - 1)
          .attr("height", function(d) { return height - y(d.y); })
          .attr("fill", function(d) { return colorScale(d.y) });
      
      bar.append("text")
          .attr("dy", ".75em")
          .attr("y", -12)
          .attr("x", (x(data[0].dx) - x(0)) / 2)
          .attr("text-anchor", "middle")
          .text(function(d) { return d.y; })
        ;
      
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
}

function recWpaPlot2() {
    var color = "steelblue";
    rb2 = document.getElementById('selDataset2').value;
    values = playerfileData2[rb2].pass.win_probability_added;

    var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

      var yMax = d3.max(data, function(d){return d.length});
      var yMin = d3.min(data, function(d){return d.length});
      var colorScale = d3.scale.linear()
                  .domain([yMin, yMax])
                  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
      
      var y = d3.scale.linear()
          .domain([0, yMax])
          .range([height, 0]);
      
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      
      d3.select("#rec_Wpa2").select("svg").remove(); 

      var svg = d3.select("#rec_Wpa2").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var bar = svg.selectAll(".bar")
          .data(data)
          .enter().append("g")
          .attr("class", "bar")
          .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
      
      bar.append("rect")
          .attr("x", 1)
          .attr("width", (x(data[0].dx) - x(0)) - 1)
          .attr("height", function(d) { return height - y(d.y); })
          .attr("fill", function(d) { return colorScale(d.y) });
      
      bar.append("text")
          .attr("dy", ".75em")
          .attr("y", -12)
          .attr("x", (x(data[0].dx) - x(0)) / 2)
          .attr("text-anchor", "middle")
          .text(function(d) { return d.y; })
        ;
      
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
}

// Function to run when data changes (used above)
function optionChanged2(sample) {
    // metaData(sample);
    demInfo2(sample);
    buildPlot2(sample);
    rushEpaPlot2();
    recEpaPlot2();
    rushWpaPlot2();
    recWpaPlot2();
}