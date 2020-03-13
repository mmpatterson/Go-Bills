filePath = '../csv/2019_gaps.csv';

var fileData;

// Load in data from csv
d3.csv(filePath).then(info => {
    fileData = info;
    console.log('Printing filePath data:');
    console.log(fileData);
    // console.log('Names:');
    // console.log(fileData.names);
    d3.selectAll("body").on("change", init());
});

/*
* Function initializes the data that appear in the dropdown
*/
function init() {
    var dropNames = ['Choose-RB'];
    for (i = 0; i < fileData.length; i++){
        dropNames.push(fileData[i].rb_name)
    }
    console.log('Printing dropNames:')
    console.log(dropNames);
    var selector = d3.select("#selDataset");
    dropNames.forEach(individual => {
        selector
            .append("option")
            .text(individual)
            .property("value", individual);
    });
    optionChanged(fileData.rb_name);
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
     console.log("Printing Individual");
     console.log(individual.rb_name);
    //  Get the gap names
     var gaps = [individual.left_end, individual.left_tackle, individual.left_guard, individual.right_guard, 
        individual.right_tackle, individual.right_end];
     gapsString = gaps.map(d => d);
     console.log('Gaps:');
     console.log(gaps);

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
         title: 'Rush Percentage by Gap',
         height: 600,
         width: 400,
         xaxis: {title:'Gap'
         },
         yaxis: {title:'Percentage of Runs'
         }
     };
    // // Create the bar chart
    //  Plotly.newPlot("bar", player, layout);
    Plotly.newPlot("sample-metadata", player, layout);
    // buildPlot(player)
}
// Function to run when data changes (used above)
function optionChanged(sample) {
    // metaData(sample);
    buildPlot(sample);

}