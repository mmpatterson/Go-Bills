// var rbFilePath = 'csv/rb_plays_2019.json';

// var playerFileData;
// var selectedText;

// // Load in data from csv
// d3.json(rbFilePath).then(info => {
//     playerFileData = info;
//     d3.selectAll("body").on("change", locInit());
// });

// // /*
// // * Try to grab the data that appear in the dropdown
// // */
// function locInit() {
//     // var selectedText = d3.select('#selDataset option:checked').text();
//     selectedText = document.getElementById('selDataset').value;
//     console.log('Selected Text: ', selectedText);
//     console.log(playerFileData);
//     dropOptionChanged(selectedText);
// }

// // /*
// // * Creates the bar chart
// // */
// function epaPlot(rb) {
//     //  console.log("The Data:")
//     //  console.log(fileData);
//     //  var individual = fileData.filter(player => player.rb_name == rb);

//     // console.log('Player: ', playerFileData[rb].player);
//     console.log("Player File Data: ", playerFileData[rb].player);
//     // console.log('EPA: ', playerFileData[rb].run.epa);

//     // var margin = {top: 10, right: 30, bottom: 30, left: 40},
//     // width = 460 - margin.left - margin.right,
//     // height = 400 - margin.top - margin.bottom;

//     // var svg = d3.select("rb_locations")
//     // .append("svg")
//     // .attr("width", width + margin.left + margin.right)
//     // .attr("height", height + margin.top + margin.bottom)
//     // .append("g")
//     // .attr("transform",
//     //       "translate(" + margin.left + "," + margin.top + ")");

//     // var x = d3.scaleLinear()
//     // .domain([Math.min(playerFileData[rb].run.epa), Math.max(playerFileData[rb].run.epa)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
//     // .range([0, width]);
//     // svg.append("g")
//     // .attr("transform", "translate(0," + height + ")")
//     // .call(d3.axisBottom(x));

//     //  // Y axis: initialization
//     // var y = d3.scaleLinear()
//     // .range([height, 0]);
//     // var yAxis = svg.append("g")

//     // function update(nBin) {
//     //     // set the parameters for the histogram
//     //     var histogram = d3.histogram()
//     //         .value(function(d) { return playerFileData[d].run.epa; })   // I need to give the vector of value
//     //         .domain(x.domain())  // then the domain of the graphic
//     //         .thresholds(x.ticks(nBin)); // then the numbers of bins
    
//     //     // And apply this function to data to get the bins
//     //     var bins = histogram(rb);
    
//     //     // Y axis: update now that we know the domain
//     //     y.domain([0, d3.max(bins, function(d) { return playerFileData[d].run.epa.length; })]);   // d3.hist has to be called before the Y axis obviously
//     //     yAxis
//     //         .transition()
//     //         .duration(1000)
//     //         .call(d3.axisLeft(y));
    
//     //     // Join the rect with the bins data
//     //     var u = svg.selectAll("rect")
//     //         .data(bins)
    
//     //     // Manage the existing bars and eventually the new ones:
//     //     u
//     //         .enter()
//     //         .append("rect") // Add a new rect for each new elements
//     //         .merge(u) // get the already existing elements as well
//     //         .transition() // and apply changes to all of them
//     //         .duration(1000)
//     //           .attr("x", 1)
//     //           .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
//     //           .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
//     //           .attr("height", function(d) { return height - y(d.length); })
//     //           .style("fill", "#69b3a2")
    
    
//     //     // If less bar in the new histogram, I delete the ones not in use anymore
//     //     u
//     //         .exit()
//     //         .remove()
    
//     //     }
    
//     //   // Initialize with 20 bins
//     //   update(20)
    
//     //   // Listen to the button -> update if user change it
//     //   d3.select("#nBin").on("input", function() {
//     //     update(+this.value);
//     //   });
//     var trace1 = {
//         type: "bar",
//         x: playerFileData[rb].player,
//         y: playerFileData[rb].run.epa[0],
//        //  text: otuLabels,
//         marker: {
//            // This blue is a cool color
//            color: 'rgb(43,140,190)'
//         },
//         orientation: "v"
//     };

//    // //  Put the data in an array
//     var player = [trace1];

//    //  Define the layout
//     var layout = {
//         title: 'EPA by Yard Line: ' + playerFileData[rb].player,
//         height: 600,
//         width: 400,
//         xaxis: {title:'Yard Line'
//         },
//         yaxis: {title:'EPA'
//         }
//     };
//    // // Create the bar chart
//    //  Plotly.newPlot("bar", player, layout);
//    Plotly.newPlot("rb_locations", player, layout);

// }
// // // Function to run when data changes (used above)
// function dropOptionChanged(sample) {
//     // metaData(sample);
//     epaPlot(sample);
// }