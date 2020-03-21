var width = 1280;
var height = 700;

// D3 Projection
var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])    // translate to center of screen
    .scale([1000]);          // scale things down so see entire US
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height),
    g = svg.append('g');

// Append Div for tooltip to SVG
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var selectedState = null;

svg.append('text')
    .attr('x', width/2)
    .attr('y', 50)
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .style('font-size', '50px')
    .text('Coronavirus US Update');

Promise.all([
    d3.json('/get-coronavirus-data'),
    d3.json('https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json'),
    d3.json('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json')
]).then( ([coronavirus, usState, state_name_mapping]) => {
    renderMap(g, coronavirus, usState, selectedState, state_name_mapping, mapOnClick);
    renderTable(coronavirus, tableOnClick, state_name_mapping);
});

const mapOnClick = d => {
    selectedState = d.properties.name;
    Promise.all([
        d3.json('/get-coronavirus-data'),
        d3.json('https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json'),
        d3.json('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json')
    ]).then( ([coronavirus, usState, state_name_mapping]) => {
        renderMap(g, coronavirus, usState, selectedState, state_name_mapping, mapOnClick);
    });
};

const tableOnClick = d => {
    selectedState = d.state;
    Promise.all([
        d3.json('/get-coronavirus-data'),
        d3.json('https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json'),
        d3.json('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json')
    ]).then( ([coronavirus, usState, state_name_mapping]) => {
        renderMap(g, coronavirus, usState, selectedState, state_name_mapping, mapOnClick);
    });
};

// svg.call(d3.zoom().on('zoom', () => {
//     g.attr('transform', d3.event.transform);
// }));
