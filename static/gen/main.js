var defaultColor = "#dddddd7b";
// var color = d3.scalePow()
//     .range([defaultColor, 'red']);
var color = d3.scaleSequential(d3.interpolateOrRd).domain([0,6]);

const level = accumulate => {
    if (accumulate == 0)
        return 0;
    else if (accumulate <= 10)
        return 1;
    else if (accumulate <= 100)
        return 2;
    else if (accumulate <= 500)
        return 3;
    else if (accumulate <= 1000)
        return 4;
    else if (accumulate <= 5000)
        return 5;
    else
        return 6;
};

const mergeInfo = (coronavirus, usState, state_name_mapping) => {
    for (var i = 0; i < coronavirus.length; i++) {
        // var dataState = state_name_mapping[coronavirus[i]["state"]];
        var newCase = coronavirus[i]["new"],
            accumulate = coronavirus[i]["accumulate"],
            death = coronavirus[i]["death"],
            cured = coronavirus[i]["cured"];

        // Find the corresponding state inside the GeoJSON
        
        for (var j = 0; j < usState.features.length; j++) {
            var state = usState.features[j].properties.name;

            if (coronavirus[i]['state'] == state) {

                // Copy the data value into the JSON
                usState.features[j].properties.newCase = newCase;
                usState.features[j].properties.accumulate = accumulate;
                usState.features[j].properties.death = death;
                usState.features[j].properties.cured = cured;
                usState.features[j].properties.level = level(accumulate);

                // Stop looking through the JSON
                break;
            }
        }
    }
    return usState
};

const renderMap = (g, coronavirus, usState, selectedState, state_name_mapping, mapOnClick) => {
    // color.domain([0, 300]);
    
    usState = mergeInfo(coronavirus, usState, state_name_mapping);
    
    // Bind the data to the SVG and create one path per GeoJSON feature
    var paths = g.selectAll('path').data(usState.features);
    
    paths.enter().append("path")
        .attr("d", path)
        .on('click', mapOnClick)
        .merge(paths)
        .style("stroke", d => {
            if (d.properties.name == selectedState) {
                return '#fffead';
            }
            return 'rgb(135, 130, 130)';
        }).style("stroke-width", d => {
            if (d.properties.name == selectedState) {
                return "3";
            }
            return "1";
        })
        .style("fill", d => color(d.properties.level))
        .append('title')
            .text(d => {
                return `New Cases: ${d.properties.newCase},\n`+
                `Accumulate Cases: ${d.properties.accumulate},\n`+
                `Death: ${d.properties.death},\n`+
                `Cured: ${d.properties.cured}`
            });
    renderMapLabel(g, usState, state_name_mapping);
}

const renderMapLabel = (g, usState, state_name_mapping) => {
    var reverse_mapping = {};
    for (var obj in state_name_mapping) {
        reverse_mapping[state_name_mapping[obj]] = obj;
    }
    // add state names
    g.append("g")
     .attr("class", "states-names")
     .selectAll("text")
        .data(usState.features.filter(d => d.properties.name != "Puerto Rico"))
     .enter().append("svg:text")
        .text(d => reverse_mapping[d.properties.name])
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .attr("text-anchor","middle")
        .attr('font-size', '9px')
        .attr('fill', 'white');
}

const renderTable = (coronavirus, tableOnClick, state_name_mapping) => {
    const table = d3.select('#table').append('table'),
          titles = Object.keys(coronavirus[0]),
          thead = table.append('thead'),
          tbody = table.append('tbody');
    // console.log(state_name_mapping);
    // for (var i = 0; i < coronavirus.length; i++) {
    //   console.log('state:' + coronavirus[i]['state']);
    //   console.log('state mapping:' + state_name_mapping[coronavirus[i]['state']]);
    //   coronavirus[i]['state'] = state_name_mapping[coronavirus[i]['state']];
    // }
    thead.append('tr')
           .selectAll('th')
           .data(titles).enter()
         .append('th')
             .text( d => d);
    const rows = tbody.selectAll('tr')
                      .data(coronavirus)
                      .enter().append('tr')
                      .on('click', tableOnClick);
    const cells = rows.selectAll('td')
                      .data(row =>
                        titles.map(title => {
                            return {'title': title, 'value': row[title]}
                        })
                       ).enter()
                      .append('td')
                        .attr("style", "font-family: Courier") // sets the font style
                        .text(function(d) { return d.value; });
}

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
