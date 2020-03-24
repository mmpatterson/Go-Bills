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
    d3.selectAll("RB1").on("change", init());
});

// Load in data from json
d3.json(rbFilePath).then(info => {
    playerFileData = info;
    console.log(playerFileData);
    d3.selectAll("RB1").on("change", init());
});

/*
* Function initializes the data that appear in the dropdown
*/
function init() {
    var dropNames = ['Choose-RB'];
    for (i = 0; i < fileData.length; i++){
        dropNames.push(fileData[i].rb_name)
    }
    // console.log('Printing dropNames:')
    // console.log(dropNames);
    var selector = d3.select("#selDataset");
    dropNames.forEach(individual => {
        selector
            .append("option")
            .text(individual)
            .property("value", individual);
    });
    optionChanged(fileData.rb_name);
}

function demInfo(rb){
    rush_yards = playerFileData[rb].run.yards_gained.reduce(function(a, b){
        return a + b;
    }, 0);
    console.log('Rush Yards:', rush_yards);

    console.log('Rush EPA: ', playerFileData[rb].run.epa);
    
    console.log('First Rush', playerFileData[rb].run.epa[1]);
    var rush_epa = 0;
    // rush_epa = playerFileData[rb].run.epa.reduce(function(a, b){
    //     return a + b;
    // }, 0);
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

    console.log("Rush EPA", rush_epa);

    player_info = {"Rushing Yards": rush_yards, "Rushing Total EPA": rush_epa, "Rushing Touchdowns ": rush_touchdowns, "Receiving Yards": rec_yards, 
        "Receiving Total EPA": rec_epa, "Receiving Touchdowns": pass_touchdowns};

    d3.select("#demInfo").selectAll("div").remove(); 

    var selection = d3.select('#demInfo');
    selection.html("");
    Object.entries(player_info).forEach(([key, value]) => {
        selection.append('div').text(`${key}: ${value}`)
    })
}

/*
* Creates the bar chart
*/
function buildPlot(rb) {
    //  console.log("The Data:")
    //  console.log(fileData);
    //  var individual = fileData.filter(player => player.rb_name == rb);
    var individual;
    var index;
    for (i = 0; i < fileData.length; i++){
        if(fileData[i].rb_name == rb){
            index = i;
            individual = fileData[index];
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
    Plotly.newPlot("rb_gaps", player, layout);
    // buildPlot(player)
}

function rushEpaPlot() {
    var color = "steelblue";
    rb = document.getElementById('selDataset').value;
    values = playerFileData[rb].run.epa;
    console.log(playerFileData[rb]);

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
      
      d3.select("#rush_epa").select("svg").remove(); 

      var svg = d3.select("#rush_epa").append("svg")
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

function recEpaPlot() {
    var color = "steelblue";
    rb = document.getElementById('selDataset').value;
    rec_values = playerFileData[rb].pass.epa;

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
      
      d3.select("#rec_epa").select("svg").remove(); 

      var svg2 = d3.select("#rec_epa").append("svg")
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

function rushWpaPlot() {
    var color = "steelblue";
    rb = document.getElementById('selDataset').value;
    values = playerFileData[rb].run.win_probability_added;

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
      
      d3.select("#rush_Wpa").select("svg").remove(); 

      var svg = d3.select("#rush_Wpa").append("svg")
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

function recWpaPlot() {
    var color = "steelblue";
    rb = document.getElementById('selDataset').value;
    values = playerFileData[rb].pass.win_probability_added;

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
      
      d3.select("#rec_Wpa").select("svg").remove(); 

      var svg = d3.select("#rec_Wpa").append("svg")
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
function optionChanged(sample) {
    // metaData(sample);
    buildPlot(sample);
    demInfo(sample);
    rushEpaPlot();
    recEpaPlot();
    rushWpaPlot();
    recWpaPlot();
}