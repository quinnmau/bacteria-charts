'use strict';

//when the document is ready
$(function() {
    
    //makes an asynchronous request to get the data then builds respective charts
    d3.csv('data/antibiotics_data.csv', function(error, data) {
        console.log(data);
        buildGraph1(data, 'plot1');
        getDataBox2('Penicilin', data);
        formatTrace2('Penicilin', data);
        buildBarGraph2(data, 'plot2', 'Penicilin');
        buildBarGraph2(data, 'plot3', "Streptomycin ");
        buildBarGraph2(data, 'plot4', 'Neomycin');
    });
    
    //puts data into an object
    function getDataBox1(drugName, data) {
        var dataBox = {};
        data.forEach(function(d) {
            dataBox[d['Bacteria ']] = {
                mic: d[drugName],
                stain: d["Gram Staining "],
                penicilin: d['Penicilin'],
                neomycin: d['Neomycin'],
                streptomycin: d["Streptomycin "]
            }
        });
        return dataBox;
    }
    
    //formats object from getDataBox so plotly can graph it in buildgraph1
    function formatTrace1(drugName, data) {
        var dataBox = getDataBox1(drugName, data);
        var keys = Object.keys(dataBox);
        keys.sort();
        var values = keys.map(function(d) {
            var obj = dataBox[d];
            return obj.mic;
        });
        var trace = {
            x: keys,
            y: values,
            type: 'scatter',
            name: drugName,
            mode: 'markers',
            marker: {
                opacity: keys.map(function(d) {
                    var obj = dataBox[d];
                    if ((obj.neomycin < obj.streptomycin && obj.neomycin < obj.penicilin && drugName == 'Neomycin') || 
                    (obj.streptomycin < obj.neomycin && obj.streptomycin < obj.penicilin && drugName == "Streptomycin ") || 
                    (obj.penicilin < obj.streptomycin && obj.penicilin < obj.neomycin && drugName == 'Penicilin')) {
                        return 1.0;
                    } else {
                        return 0.2;
                    }
                }),
                size: 20
            }
        };
        return trace;
    }
    
    function getDataBox2(drugName, data) {
        var dataBox = {};
        var data1 = data;
        data1.sort(function(a, b) {
            if (a["Gram Staining "] === b["Gram Staining "]) {
                return a["Bacteria "].localeCompare(b["Bacteria "]);
            }
            return a["Gram Staining "].localeCompare(b["Gram Staining "]);
        });
        console.log(data1);
        data.forEach(function(d) {
            dataBox[d[drugName]] = {
                bacteria: d["Bacteria "],
                stain: d["Gram Staining "]
            }
        });
        return dataBox;
    }
    
    //formats object from getDataBox1 to be passed to buildbargraph2
    function formatTrace2(drugName, data) {
        var dataBox = getDataBox1(drugName, data);
        var keys = Object.keys(dataBox);
        //sorts keys first by stain then by alphabetical order
        keys.sort(function(a, b) {
            var obj1 = dataBox[a];
            var obj2 = dataBox[b];
            if (obj1["stain"] === obj2["stain"]) {
                return a.localeCompare(b);
            } else {
                return obj1["stain"].localeCompare(obj2["stain"]);
            }
        });
        console.log(keys);
        var values = keys.map(function(d) {
            var obj = dataBox[d];
            return obj.mic;
        });
        var trace = {
            x: keys,
            y: values,
            type: 'bar',
            marker: {
                color: keys.map(function(d) {
                    var obj = dataBox[d];
                    if (obj.stain == "positive") {
                        return '#501DA6';
                    } else {
                        return '#F51BDC';
                    }
                })
            },
            //name needs to be either 'positive' or 'negative' depending on
            //the given bacterias color/stain
            name: [function() {
                if (trace.marker.color == '#501DA6') {
                    return 'Positive';
                } else {
                    return 'Negative';
                }
            }]
        };
        return trace;
    }
    
    //builds the first graph
    function buildGraph1(data, plot) {
        var traces = [formatTrace1('Penicilin', data), formatTrace1("Streptomycin ", data), formatTrace1('Neomycin', data)];
        var layout = {
            title: 'Most Effective Drug for Each Bacteria',
            margin: {
                b: 120
            },
            xaxis: {
                title: 'Bacteria'
            },
            yaxis: {
                title: 'MIC (Drug Effectiveness)',
                range: [-1, 12]
            }
        };
        Plotly.newPlot(plot, traces, layout);
    }
    
    //builds second set of graphs
    function buildBarGraph2(data, plot, drugName) {
        var traces = [formatTrace2(drugName, data)];
        var layout = {
            title: drugName,
            margin: {
                b: 120
            },
            xaxis: {
                title: 'Bacteria'
            },
            yaxis: {
                title: 'MIC (Drug Effectiveness)',
                range: [0, 40]
            },
            //legend is visible but incorrect. needs to be a key for 
            //stain 'positive' and stain 'negative'
            showlegend: true
        };
        Plotly.newPlot(plot, traces, layout);
    }
    
});