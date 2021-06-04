function buildMetadata(sample) {
    d3.json("././data/samples.json").then((data) => {

        var selectMetaData = data.metadata.filter(sampleObj => sampleObj.id == sample);

        var demoInfo = d3.select("#sample-metadata");

        demoInfo.html("");

        Object.entries(selectMetaData[0]).forEach(([key, value]) => {
            demoInfo.append("h6").text(`${key}: ${value}`);
            
            console.log(key, value);
        });
    });
}

function buildPlot(sample) {
    d3.json("././data/samples.json").then((data) => {
        var result_list = data.samples.filter(sampleObj => sampleObj.id == sample);
        var sample_values = result_list[0].sample_values;
        var otu_ids = result_list[0].otu_ids;
        var otu_labels = result_list[0].otu_labels;


        // Create the Bar chart
        var y_value = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var bar_data = [
            {
            x: sample_values.slice(0, 10).reverse(),
            y: y_value,
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            }
        ];


        Plotly.newPlot("bar", bar_data);

        // Create the Bubble plot chart
        var bubble_data = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                }
            } 
        ]; 

        Plotly.newPlot("bubble", bubble_data);

        // (Optional) Create the Gauge plot chart
        var gauge_data = [
            {
                value: selectMetaData[0].wfreq,
                mode: "gauge number",
                gauge: { axis: { 
                        range: [null, 9] },
                    steps: [
                    { range: [0, 1], color: "rgb(247, 242, 238)"},
                    { range: [1, 2], color: "rgb(243, 236, 223)" },
                    { range: [2, 3], color: "rgb(233, 221, 207)" },
                    { range: [3, 4], color: "rgb(218, 222, 191)" },
                    { range: [4, 5], color: "rgb(200, 211, 172)" },
                    { range: [5, 6], color: "rgb(187, 210, 166)" },
                    { range: [6, 7], color: "rgb(174, 190, 154)" },
                    { range: [7, 8], color: "rgb(156, 194, 145)" },
                    { range: [8, 9], color: "rgb(134, 178, 137)" }
                    ]
                }
            } 
        ];  

        Plotly.newPlot("gauge", gauge_data);
    });
}

// Create the initial plot
function init() {
    
    var dropdownMenu = d3.select("#selDataset");

    d3.json("././data/samples.json").then((data) => {
        
        data.names.forEach((sample) => {
            dropdownMenu
                .append("option")
                .property("value", sample)
                .text(sample);
        });

        // Create initial charts using the first sample data
        buildPlot(data.names[0]);
        buildMetadata(data.names[0]);
    });
}
// Get the new data when the option changes
function updateChanges(newData) {
    buildPlot(newData);
    buildMetadata(newData);
  }

init();