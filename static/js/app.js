// Define the URL for the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create a promise to fetch the JSON data using D3.js
const dataPromise = d3.json(url);

// Function to display demographic information for a selected individual
function demographicInfo(id) {
    // Select the dropdown menu element
    var dropdownMenu = d3.select("#selDataset");
    
    // Fetch the JSON data and process it
    dataPromise.then(function(data) {
        var metadata = data.metadata;
        
        // Filter the metadata to get data for the selected ID
        var selectedData = metadata.filter(entry => entry.id == id)[0];
        
        // Select the element to display demographic info
        var box = d3.select("#sample-metadata");
        
        // Clear any previous data in the display
        box.text("");
        
        // Get key-value pairs from the selected data and display them
        var entries = Object.entries(selectedData);
        for (let i=0; i<entries.length; i++){
            box.append("p").text(`${entries[i][0]}: ${entries[i][1]}`);
        }
    });
}

// Function to create and update charts based on the selected ID
function plot(id) {
    // Select the dropdown menu element
    var dropdownMenu = d3.select("#selDataset");
    
    // Fetch the JSON data and process it
    dataPromise.then(function(data) {
        var samples = data.samples;
        
        // Filter the samples data to get data for the selected ID
        var selectedData = samples.filter(entry => entry.id == id)[0];
        var otu_ids = selectedData.otu_ids;
        var sample_values = selectedData.sample_values;
        var otu_labels = selectedData.otu_labels;
        
        // Slice and reverse the data to get the top 10 values
        var otuIds = otu_ids.slice(0, 10).reverse();
        var sampleValues = sample_values.slice(0, 10).reverse();
        var otuLabels = otu_labels.slice(0, 10).reverse();

        // Create data for the horizontal bar chart
        var bardata = [{
            x: sampleValues,
            y: otuIds.map(id => `OTU ${id}`),
            type: "bar",
            text: otuLabels,
            orientation: 'h'
        }];
        
        // Create data for the bubble chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'YlGnBu',
            }
        }];
        
        // Define the layout for the bubble chart
        var bubbleLayout = {
            xaxis: {title: "OTU ID"}
        };
        
        // Create and update the charts using Plotly
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        Plotly.newPlot("bar", bardata);
    });
}

// Function called when the dropdown menu selection changes
function optionChanged(id) {
    // Update demographic info and charts for the selected ID
    demographicInfo(id);
    plot(id);
}

// Initialize the dropdown menu and load data for the default (first) option
function init() {
    var dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and process it
    dataPromise.then(function(data) {
        var names = data.names;

        // Populate the dropdown menu with options based on available names
        for (let i = 0; i < names.length; i++) {
            dropdownMenu.append("option").text(names[i]).property("value", names[i]);
        }

        // Trigger the optionChanged function for the default (first) option
        optionChanged(names[0]);
    });
}

// Initialize the application
init();
