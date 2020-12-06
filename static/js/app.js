// Reading in belly button biodiversity data for analysis
d3.json("samples.json").then((sampleData) => {
    console.log(sampleData);

    // Storing each patient ID into an array
    var names = sampleData.names;

    // Using d3 to populate the dropdown options with all of the patient IDs
    d3.select("#selDataset").selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .html(d => d);
    
    // Defining an init function which will load the graphs when the page is first loaded
    function init(i) {
        // For the initial page load, set the index value to 0
        // When a new dropdown option is selected the index value will be passed to this variable
        i = i || 0;

        // Storing the data from each sample into an object
        var patientData = sampleData.samples;

        // Sorting the new object by the sample values
        var sortedData = patientData.sort((a, b) => b.sample_values - a.sample_values);

        // For the first patient, find the first 10 values for the plot
        var sampleValues = sortedData[i].sample_values.slice(0, 10).reverse();
        var otuIds = sortedData[i].otu_ids.slice(0, 10);
        var otuLabels = sortedData[i].otu_labels.slice(0, 10);
       
        // Creating an empty array
        var chartLabels = [];
        
        // Concatenating the OTU ID with text for displaying on the chart
        otuIds.forEach(x => chartLabels.push("OTU " + x));

        // Setting the data to plot
        var data = [{
            type: "bar",
            x: sampleValues,
            y: chartLabels.reverse(),
            orientation: "h",
            text: otuLabels
        }]

        // Setting the plot title
        var layout = {
            title: "Top 10 OTUs"
        }

        // Drawing the plot with Plotly
        Plotly.newPlot("bar", data, layout, {displayModeBar: false});

        // Storing values for bubble chart into variables
        var sampleValues = sampleData.samples[i].sample_values; // y values & marker size
        var otuIds = sampleData.samples[i].otu_ids; // x values
        var otuLables = sampleData.samples[i].otu_labels;

        // Setting the data to plot
        var data = [{
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues.map(x => x / 1.25),
                color: otuIds
            }
        }];

        // Setting the plot title
        var layout = {
            title: "Bubble Chart"
        }

        // Drawing the bubble chart with Plotly
        Plotly.newPlot("bubble", data, layout);

        // Demographic Info
        var metadata = Object.entries(sampleData.metadata[i]);

        // Using d3 to select the panel body element
        var panelBody = d3.select(".panel-body");
        var panelData = [];

        // Creating strings to push to the panel
        metadata.forEach(x => panelData.push(`${x[0]}: ${x[1]}`));

        // Clearing the existing HTML to be updated
        d3.select(".panel-body").html("");

        // Updating the values in the panel
        d3.select(".panel-body").selectAll("p")
            .data(panelData)
            .enter()
            .append("p")
            .html(d => d)

        console.log(panelData);
    }

    // Setting up the event listener
    d3.selectAll("#selDataset").on("change", optionChanged);

    // Updating plot data based on dropdown value
    function optionChanged() {
        // Using d3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");

        // Storing the value into a variable
        var dropdownValue = dropdownMenu.property("value");

        console.log(names.findIndex(x => x === dropdownValue));

        // Running the init function using the index of the value in the dropdown box
        init(names.findIndex(x => x === dropdownValue));
    };

    // Initialising the page
    init();
});